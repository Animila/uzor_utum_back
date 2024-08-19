import {PrismaCertificateRepo} from "../../infrastructure/prisma/repo/PrismaCertificateRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {GetAllCertificate} from "../../useCases/certificate/certificateGetAll";
import {randomUUID} from "node:crypto";
import axios from "axios";
import {success} from "concurrently/dist/src/defaults";
import {GetByIdCertificate} from "../../useCases/certificate/certificateGetById";
import {DeleteCertificate} from "../../useCases/certificate/certificateDelete";
import {rabbit} from "../../config/SMTPOptions";

const certRepo = new PrismaCertificateRepo();

export async function getPaymentStatus(request: FastifyRequest, reply: FastifyReply) {
    try {

        const data: any = request.body
        console.log('Вход', data.event)
        console.log('Дата', data.object)
        if(data.event === "payment.waiting_for_capture") {
            try {
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
            if(dataObject.entity_type === "certificate") {
                const getCertificate = new GetByIdCertificate(certRepo)
                const cert = await getCertificate.execute({id: dataObject.entity_id})
                await rabbit.sendEmail({
                    text: "Пин-код сертификата: " + cert.getCode().toString(),
                    subject: 'Пин-код сертификата',
                    to: cert.getEmail()?.getFull()!
                })
            } else {

            }
        }

        if(data.event === "payment.canceled") {
            const dataObject = data.object.metadata
            if(dataObject.entity_type === "certificate") {
                const del = new DeleteCertificate(certRepo)
                await del.execute({id: dataObject.entity_id})
            } else {

            }
        }

    } catch (error: any) {
        console.log('345678', error.message)
    }
}
