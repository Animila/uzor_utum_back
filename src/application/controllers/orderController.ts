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
import {getDataPayment, initialPayment} from "../../infrastructure/youkassa/initialPayment";
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
import {UserMap} from "../../mappers/UserMap";
import {SendTypeMap} from "../../mappers/SendTypeMap";
import {ReceiverMap} from "../../mappers/ReceiverMap";
import {ShopMap} from "../../mappers/ShopMap";
import {CertificateMap} from "../../mappers/CertificateMap";
import {PromoCodeMap} from "../../mappers/PromoCodeMap";
import {GetByIdCertificateType} from "../../useCases/certificate/certificateTypeGetById";
import {PrismaCertificateTypeRepo} from "../../infrastructure/prisma/repo/PrismaCertificateTypeRepo";
import {CertificateTypeMap} from "../../mappers/CertificateTypeMap";
import {OrderStatus} from "../../domain/order/valueObjects/OrderStatus";
import {bool} from "sharp";
import {PromoCode} from "../../domain/promocode/promocode";

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
const certTypeRepo = new PrismaCertificateTypeRepo()

export async function createOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    const data = request.body;
    const getSendType = new GetByIdSendType(sendTypeRepo)
    const getShop = new GetByIdShop(shopRepo)
    const getReceiver = new GetByIdReceiver(receiverRepo)
    const getCertificate = new GetByIdCertificate(certRepo)
    const getCertificateType = new GetByIdCertificateType(certTypeRepo)
    const getPromocode = new GetByIdPromoCode(promoRepo)
    const getProduct = new GetByIdProducts(productRepo, fileRepo)
    const getDiscount = new GetByProductIdDiscount(discountRepo)
    const getCountBonus = new GetBySumUserBonus(bonusRepo)
    const getUser = new GetUserById(userRep)

    let totalPrice = 0

    try {
        await getReceiver.execute({id: data.receiver_id})
        data.shop_id ? await getShop.execute({id: data.shop_id}) : undefined

        //@ts-ignore
        const productsOrError = await Promise.all(data.items.map(async item => {
            const data = await getProduct.execute({id: item.product_id})
            const dataPer = ProductMap.toPersistence(data)
            try {
                dataPer.discount = DiscountMap.toPersistence(await getDiscount.execute({product_id: data.getId()}))
                totalPrice += Math.floor((dataPer.price * ((100 - dataPer.discount.percentage) / 100)) * item.count)
            } catch (e) {
                totalPrice += Math.floor(dataPer.price * item.count)
                console.log(e)
            }
            return dataPer
        }))

        const typeSend = await getSendType.execute({id: data.send_type_id})
        totalPrice += typeSend.getPrice()

        if(data.certificate_id) {
            const cart = await getCertificate.execute({id: data.certificate_id})
            if(cart.getActivated()) {
                throw new Error(JSON.stringify({
                    status: 400,
                    message: [
                        {
                            type: 'certificate_id',
                            message: 'Сертификат уже активирован'
                        }
                    ]
                }))
            }
            const cartType = await getCertificateType.execute({id: cart.getCertificateTypeId()})
            totalPrice -= cartType.getValue()
        }
        if(data.promocode_id) {
            const promo = await getPromocode.execute({id: data.promocode_id, user_id: data.user_id, email: data.email, phone: data.phone})
            if(promo instanceof Boolean || !promo || !(promo instanceof PromoCode)) {
                throw new Error(JSON.stringify({
                    status: 400,
                    message: [
                        {
                            type: 'promocode_id',
                            message: 'Промокод уже использовался данным пользователем'
                        }
                    ]
                }))
            }
            totalPrice =  Math.floor(totalPrice - (totalPrice * (promo.getDiscount()/100)))
        }
        return



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
            totalPrice = totalPrice - data.use_bonus
        }
        data.add_bonus = Math.floor(totalPrice / 100 * 5)
        data.total_amount = totalPrice


    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }

    try {
        const createOrder = new CreateOrder(orderRepo);
        const order = await createOrder.execute(data);

        if(order) {
            const deleteCart = new DeleteItemCart(cartRepo)
            //@ts-ignore
            const results = await Promise.all(data.items.map(async item => {
                const res = await deleteCart.execute({id: item.id})
            }))
        }
        // создать платеж
        const idl = order.getId().split('-');
        const resultPay = await initialPayment(
            "product",
            order.getId(),
            `Оплата заказа №${idl[idl.length - 1]}`,
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

export async function editOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    try {
        const data = request.body;
        const { id } = request.params;

        const getOrder = new GetByIdOrder(orderRepo);
        const order = await getOrder.execute({ id });

        const statusOrError = OrderStatus.create(data.status)

        const errors: Array<{type: string, message: string}> = []
        statusOrError instanceof Error && errors.push({type: 'status', message: statusOrError.message})

        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))

        order.props.status = statusOrError as OrderStatus

        await orderRepo.save(order)
        reply.status(200).send({
            success: true,
        });

    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
        return
    }
}

export async function getAllOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    try {
        const {
            user_id,
            token,
            limit,
            offset,
            status,
            shop_id,
            send_type_id,
            updated_at,
            created_at,
            q
        } = request.query as OrderRequest['Query'];

        const getAllOrder = new GetAllOrder(orderRepo);

        const createdAt = created_at ? new Date(created_at) : undefined;
        const updatedAt = updated_at ? new Date(updated_at) : undefined;

        if(createdAt && createdAt.toDateString() === "Invalid Date" || updatedAt && updatedAt.toDateString() === "Invalid Date") {
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    (createdAt && createdAt.toDateString() === "Invalid Date") && {
                        type: 'created_at',
                        message: 'Нет created_at'
                    },
                    (updatedAt && updatedAt.toDateString() === "Invalid Date") && {
                        type: 'updated_at',
                        message: 'Нет updated_at'
                    }
                ]
            }))
        }

        const products = await getAllOrder.execute({limit: !!limit ? parseInt(limit) : 10, offset: !!offset ? parseInt(offset) : 0, user_id: user_id, token: token, status: status, send_type_id: send_type_id, shop_id: shop_id, search: q, created_at: createdAt, updated_at: updatedAt});

        const filterOrder = products.data.map(item => OrderMap.toPersistence(item)).filter(item => item != null)

        reply.status(200).send({
            success: true,
            data: filterOrder,
            pagination: {
                totalItems: products.count,
                totalPages: Math.ceil(products.count / (!!limit ? parseInt(limit) : 10)),
                currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                limit: !!limit ? parseInt(limit) : 10
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
//
export async function getByIdOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const getOrder = new GetByIdOrder(orderRepo);
        const product = await getOrder.execute({ id });

        const getUser = new GetUserById(userRep)
        const getSendType = new GetByIdSendType(sendTypeRepo)
        const getReceiver = new GetByIdReceiver(receiverRepo)
        const getShop = new GetByIdShop(shopRepo)
        const getCert = new GetByIdCertificate(certRepo)
        const getPromo = new GetByIdPromoCode(promoRepo)
        const getCertType = new GetByIdCertificateType(certTypeRepo)

        const item = OrderMap.toPersistence(product)
        if(item.user_id !== undefined) {
            const result = await getUser.execute({user_id: item.user_id})
            item.user_data = UserMap.toPersistence(result)
        }

        if(item.shop_id !== undefined) {
            const result = await getShop.execute({id: item.shop_id})
            item.shop_data = ShopMap.toPersistence(result)
        }

        if(item.certificate_id !== undefined) {
            const result = await getCert.execute({id: item.certificate_id})
            const res = await getCertType.execute({id: result.getCertificateTypeId()})
            item.certificate_data = CertificateMap.toPersistence(result)
            item.certificate_data.type = CertificateTypeMap.toPersistence(res)
        }

        if(item.promocode_id !== undefined) {
            const promo = await getPromo.execute({id: item.promocode_id})
            if(promo instanceof Boolean || !promo || !(promo instanceof PromoCode)) {
                throw new Error(JSON.stringify({
                    status: 400,
                    message: [
                        {
                            type: 'promocode_id',
                            message: 'Промокод уже использовался данным пользователем'
                        }
                    ]
                }))
            }
            item.promocode_data = PromoCodeMap.toPersistence(promo)
        }

        const resultST = await getSendType.execute({id: item.send_type_id})
        item.send_type_data = SendTypeMap.toPersistence(resultST)

        const resultR = await getReceiver.execute({id: item.receiver_id})
        item.receiver_data = ReceiverMap.toPersistence(resultR)

        const data = await getDataPayment(item.payment_id!)
        item.payment_data = data.data
        reply.status(200).send({
            success: true,
            data: item
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
