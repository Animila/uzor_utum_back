import {PrismaCertificateRepo} from "../../infrastructure/prisma/repo/PrismaCertificateRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {randomUUID} from "node:crypto";
import axios from "axios";
import {GetByIdCertificate} from "../../useCases/certificate/certificateGetById";
import {DeleteCertificate} from "../../useCases/certificate/certificateDelete";
import {rabbit} from "../../config/SMTPOptions";
import {PrismaOrderRepo} from "../../infrastructure/prisma/repo/PrismaOrderRepo";
import {GetByIdOrder} from "../../useCases/order/orderGetById";
import {OrderStatus} from "../../domain/order/valueObjects/OrderStatus";
import {scheduleSendEmail} from "../../infrastructure/nodecron/scheduleNotification";
import {CreateBonus} from "../../useCases/bonus/bonusCreate";
import {PrismaBonusRepository} from "../../infrastructure/prisma/repo/PrismaBonusRepository";

const certRepo = new PrismaCertificateRepo();
const orderRepo = new PrismaOrderRepo()
const bonusRepo = new PrismaBonusRepository()

export async function getPaymentStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getCertificate = new GetByIdCertificate(certRepo)
        const getOrder = new GetByIdOrder(orderRepo)

        const data: any = request.body
        if(data.event === "payment.waiting_for_capture") {
            try {
                if(data.object.metadata.entity_type === "product") {
                    const order = await getOrder.execute({id: data.object.metadata.entity_id})
                    // @ts-ignore
                    order.props.status = OrderStatus.create(OrderStatus.getAvailables().PENDING)
                    await orderRepo.save(order)
                }
                const url = `https://api.yookassa.ru/v3/payments/${data.object.id}/capture`;
                let auth = "Basic " + btoa(process.env.YOUKASSA_ID + ':' + process.env.YOUKASSA_SECRET)
                let headers = {
                    "Authorization": auth,
                    "Idempotence-Key": randomUUID().toString(),
                    "Content-Type": "application/json"
                };

                await axios.post(url, null,{ headers });
            } catch (e: any) {
                console.log('EEEEERRRRRROR: ',e)
            }
        }
        if(data.event === "payment.succeeded") {
            const dataObject = data.object.metadata
            const addBonus = new CreateBonus(bonusRepo)
            if(dataObject.entity_type === "certificate") {
                const cert = await getCertificate.execute({id: dataObject.entity_id})

                scheduleSendEmail(cert.getDeliveryAt(), undefined, async () => {
                    await rabbit.sendEmail({
                        text: "Пин-код сертификата: " + cert.getCode().toString(),
                        subject: 'Пин-код сертификата',
                        to: cert.getEmail()?.getFull()!
                    })
                })

            }
            if(dataObject.entity_type === "product") {
                const order = await getOrder.execute({id: dataObject.entity_id})
                if(order.getCertificateId() !== undefined) {
                    const cert = await getCertificate.execute({id: order.getCertificateId()!})
                    cert.props.activated = true
                    await certRepo.save(cert)
                }
                // @ts-ignore
                order.props.status = OrderStatus.create(OrderStatus.getAvailables().PAIDING)
                await orderRepo.save(order)
                const id = order.getId().split('-');


                if(order.getUserId() !== undefined) {
                    if(order.getUseBonus() > 0)
                        await addBonus.execute({
                            user_id: order.getUserId()!,
                            created_at: new Date(),
                            count: order.getUseBonus(),
                            description: `Оплата заказа №${id[id.length - 1]}`,
                            type: 'minus'
                        })
                    await addBonus.execute({
                        user_id: order.getUserId()!,
                        created_at: new Date(),
                        count: order.getAddBonus(),
                        description: `Зачисл ение оплаты за заказ №${id[id.length - 1]}`,
                        type: 'plus'
                    })
                }

                await rabbit.sendEmail({
                    text: `Заказ №${id[id.length - 1]} на сумму ${order.getTotalAmount()} оплачен и скоро будет отправлен`,
                    subject: `Заказ Uzor Utum`,
                    to: order.getEmail().getFull()!
                })

            }
        }

        if(data.event === "payment.canceled") {
            const dataObject = data.object.metadata
            if(dataObject.entity_type === "certificate") {
                const del = new DeleteCertificate(certRepo)
                await del.execute({id: dataObject.entity_id})
            } else {
                const getOrder = new GetByIdOrder(orderRepo)
                const order = await getOrder.execute({id: dataObject.entity_id})

                // @ts-ignore
                order.props.status = OrderStatus.create(OrderStatus.getAvailables().CANCELLED)
                await orderRepo.save(order)
            }
        }

    } catch (error: any) {
        console.log('345678', error.message)
    }
}
