import {FastifyReply, FastifyRequest} from "fastify";
import {GetByIdSendType} from "../../useCases/order/sendType";
import {PrismaSendTypeRepo} from "../../infrastructure/prisma/repo/PrismaSendTypeRepo";
import {GetByIdShop} from "../../useCases/shop/shopGetById";
import {PrismaShopRepo} from "../../infrastructure/prisma/repo/PrismaShopRepo";
import {GetByIdReceiver} from "../../useCases/order/receiver";
import {PrismaReceiverRepo} from "../../infrastructure/prisma/repo/PrismaReceiverRepo";
import {GetByIdCertificate} from "../../useCases/certificate/certificateGetById";
import {PrismaCertificateRepo} from "../../infrastructure/prisma/repo/PrismaCertificateRepo";
import {GetByIdPromoCode} from "../../useCases/promocode/promocodeGetId";
import {PrismaPromoCodeRepo} from "../../infrastructure/prisma/repo/PrismaPromocodeRepo";
import {GetByIdProducts} from "../../useCases/product/productGetById";
import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import {ProductMap} from "../../mappers/ProductMap";
import {PrismaDiscountRepo} from "../../infrastructure/prisma/repo/PrismaDiscountRepo";
import {GetByProductIdDiscount} from "../../useCases/discount/discountGetByProductId";
import {DiscountMap} from "../../mappers/DiscountMap";
import {CreateOrder} from "../../useCases/order/orderCreate";
import {PrismaOrderRepo} from "../../infrastructure/prisma/repo/PrismaOrderRepo";
import {PrismaItemCartRepository} from "../../infrastructure/prisma/repo/PrismaItemCartRepository";
import {DeleteItemCart} from "../../useCases/cart/deleteItemCart";
import {initialPayment} from "../../infrastructure/youkassa/initialPayment";
import {GetAllOrder} from "../../useCases/order/orderGetAll";
import {OrderMap} from "../../mappers/OrderMap";
import {GetByIdOrder} from "../../useCases/order/orderGetById";
import {DeleteOrder} from "../../useCases/order/orderDelete";
import {PrismaBonusRepository} from "../../infrastructure/prisma/repo/PrismaBonusRepository";
import {GetBySumUserBonus} from "../../useCases/bonus/bonusGetSumUser";
import {CreateBonus} from "../../useCases/bonus/bonusCreate";
import {Guard} from "../../domain/guard";
import {GetUserById} from "../../useCases/user/userGetById";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";

const sendTypeRepo = new PrismaSendTypeRepo()
const shopRepo = new PrismaShopRepo()
const receiverRepo = new PrismaReceiverRepo()
const certRepo = new PrismaCertificateRepo()
const promoRepo = new PrismaPromoCodeRepo()
const productRepo = new PrismaProductRepo()
const discountRepo = new PrismaDiscountRepo()
const cartRepo = new PrismaItemCartRepository()
const orderRepo = new PrismaOrderRepo()
const bonusRepo = new PrismaBonusRepository()
const userRep = new PrismaUserRepo()
const fileRepo = new PrismaFileRepo()

export async function createOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    const data = request.body;
    const addBonus = new CreateBonus(bonusRepo)


    try {
        const getSendType = new GetByIdSendType(sendTypeRepo)
        const getShop = new GetByIdShop(shopRepo)
        const getReceiver = new GetByIdReceiver(receiverRepo)
        const getCertificate = new GetByIdCertificate(certRepo)
        const getPromocode = new GetByIdPromoCode(promoRepo)
        const getProduct = new GetByIdProducts(productRepo, fileRepo)
        const getDiscount = new GetByProductIdDiscount(discountRepo)
        const getCountBonus = new GetBySumUserBonus(bonusRepo)
        const getUser = new GetUserById(userRep)

        //@ts-ignore
        const productsOrError = await Promise.all(data.items.map(async item => {
            const data = await getProduct.execute({id: item.product_id})
            const dataPer = ProductMap.toPersistence(data)
            try {
                dataPer.discount = DiscountMap.toPersistence(await getDiscount.execute({product_id: data.getId()}))
            } catch (e) {
                console.log(e)
            }
            return dataPer
        }))
        console.log(productsOrError)

        await getSendType.execute({id: data.send_type_id})
        await getReceiver.execute({id: data.receiver_id})
        data.shop_id ? await getShop.execute({id: data.shop_id}) : undefined
        data.certificate_id ? await getCertificate.execute({id: data.certificate_id}) : undefined
        data.promocode_id ? await getPromocode.execute({id: data.promocode_id}) : undefined

        if(data.user_id && data.use_bonus !== 0 && data.use_bonus !== undefined) {
            await getUser.execute({user_id: data.user_id})
            const bonuses = await getCountBonus.execute({user_id: data.user_id})
            if(data.use_bonus > bonuses) {
                throw new Error(JSON.stringify({
                    status: 400,
                    message: [
                        {
                            type: 'use_bonus',
                            message: 'У пользователя нет столько бонусов'
                        }
                    ]
                }));
            }
            data.total_amount = data.total_amount - data.use_bonus
            await addBonus.execute({
                user_id: data.user_id,
                created_at: new Date(),
                count: data.use_bonus,
                description: `Оплата заказа`,
                type: 'minus'
            })
        }

    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
        return
    }

    try {
        console.log(data)
        const createOrder = new CreateOrder(orderRepo);
        const order = await createOrder.execute(data);

        if(order) {
            const deleteCart = new DeleteItemCart(cartRepo)
            //@ts-ignore
            const results = await Promise.all(data.items.map(async item => {
                const res = await deleteCart.execute({id: item.id})

                console.log('3 ',res)
            }))
        }
        // создать платеж

        const resultPay = await initialPayment(
            "product",
            order.getId(),
            `Оплата заказа №${order.getId()}`,
            order.getId(),
            data.total_amount.toString())

        if(!resultPay.success) {
            await orderRepo.delete(order.getId())
            reply.status(500).send({
                success: false,
                message: resultPay.message
            })
        }

        order.props.paymentId = resultPay.data?.payment_id

        await orderRepo.save(order)

        const resultCheck = Guard.againstNullOrUndefined(order.getUserId(), "user_id")
        if(resultCheck.succeeded) {
            await addBonus.execute({
                user_id: order.getUserId()!,
                created_at: new Date(),
                count: data.add_bonus,
                description: `Пополнение за заказ`,
                type: 'plus'
            })

        }

        reply.status(200).send({
            success: true,
            data: {
                url_confirm: resultPay.data?.payment_url
            }
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function getAllOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    try {
        const {
            phone,
            email,
            user_id,
            token,
            last_name,
            total_amount,
            first_name
        } = request.query as OrderRequest['Query'];

        const getAllOrder = new GetAllOrder(orderRepo);
        const products = await getAllOrder.execute({user_id: user_id, token: token});

        console.log(products)
        reply.status(200).send({
            success: true,
            data: products.map(item => OrderMap.toPersistence(item)).filter(item => item != null)
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}
//
export async function getByIdOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const getOrder = new GetByIdOrder(orderRepo);
        const product = await getOrder.execute({ id });

        reply.status(200).send({
            success: true,
            data: OrderMap.toPersistence(product)
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function deleteOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const delOrder = new DeleteOrder(orderRepo);
        const data = await delOrder.execute({ id });

        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}
