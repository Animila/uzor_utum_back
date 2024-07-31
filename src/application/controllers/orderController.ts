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
import {GetByIdDiscount} from "../../useCases/discount/discountGetById";
import {GetByProductIdDiscount} from "../../useCases/discount/discountGetByProductId";
import {DiscountMap} from "../../mappers/DiscountMap";

const sendTypeRepo = new PrismaSendTypeRepo()
const shopRepo = new PrismaShopRepo()
const receiverRepo = new PrismaReceiverRepo()
const certRepo = new PrismaCertificateRepo()
const promoRepo = new PrismaPromoCodeRepo()
const productRepo = new PrismaProductRepo()
const discountRepo = new PrismaDiscountRepo()

export async function createOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
    const data = request.body;

    let sendTypeOrError, shopOrError, receiverOrError, certificateOrError, promoOrError, productsOfError = undefined
    try {
        const getSendType = new GetByIdSendType(sendTypeRepo)
        const getShop = new GetByIdShop(shopRepo)
        const getReceiver = new GetByIdReceiver(receiverRepo)
        const getCertificate = new GetByIdCertificate(certRepo)
        const getPromocode = new GetByIdPromoCode(promoRepo)
        const getProduct = new GetByIdProducts(productRepo)
        const getDiscount = new GetByProductIdDiscount(discountRepo)


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

        sendTypeOrError = await getSendType.execute({id: data.send_type_id})
        receiverOrError = await getReceiver.execute({id: data.receiver_id})
        shopOrError = data.shop_id ? await getShop.execute({id: data.shop_id}) : undefined
        certificateOrError = data.certificate_id ? await getCertificate.execute({id: data.certificate_id}) : undefined
        promoOrError = data.promocode_id ? await getPromocode.execute({id: data.promocode_id}) : undefined

        console.log('норм')




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
        // const createOrder = new CreateOrder(productRepo);
        // const product = await createOrder.execute(data);
        reply.status(201).send({
            success: true,
            // data: OrderMap.toPersistence(product)
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

// export async function getAllOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
//     try {
//         const {
//             filters,
//             sortBy,
//             order,
//             categoryId,
//             materialId,
//             q ,
//             minPrice,
//             maxPrice
//         } = request.query as OrderRequest['Query'];
//         const minPriceInt = minPrice ? parseInt(minPrice) : undefined
//         const maxPriceInt = maxPrice ? parseInt(maxPrice) : undefined
//         const json = filters ? JSON.parse(filters!) : undefined
//         const getAllOrder = new GetAllOrders(productRepo);
//         const getDiscount = new GetByOrderIdDiscount(discountRepo)
//         const products = await getAllOrder.execute({categoryId, materialId, filters: json, sortBy, order, search: q, maxPrice: maxPriceInt, minPrice: minPriceInt});
//         await Promise.all(
//             products.map(async item => {
//                 try {
//                     const result = await getDiscount.execute({ product_id: item.id });
//                     item.discount = DiscountMap.toPersistence(result);
//                 } catch (error) {
//
//                 }
//             })
//         )
//         console.log(products)
//         reply.status(200).send({
//             success: true,
//             data: products
//         });
//     } catch (error: any) {
//         console.log('Error:', error.message);
//         const errors = JSON.parse(error.message);
//         reply.status(errors.status).send({
//             success: false,
//             message: errors.message
//         });
//     }
// }
//
// export async function getByIdOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
//     try {
//         const { id } = request.params;
//         const getOrder = new GetByIdOrders(productRepo);
//         const product = await getOrder.execute({ id });
//         const getDiscount = new GetByOrderIdDiscount(discountRepo)
//         const productPer = OrderMap.toPersistence(product)
//         try {
//             const result = await getDiscount.execute({product_id: product.getId()})
//             productPer.discount = DiscountMap.toPersistence(result)
//         } catch (err) {}
//         reply.status(200).send({
//             success: true,
//             data: productPer
//         });
//     } catch (error: any) {
//         console.log('Error:', error.message);
//         const errors = JSON.parse(error.message);
//         reply.status(errors.status).send({
//             success: false,
//             message: errors.message
//         });
//     }
// }
//
// export async function updateOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
//     try {
//         const { id } = request.params;
//         const data = request.body || {};
//         const updateOrder = new UpdateOrder(productRepo);
//         const product = await updateOrder.execute({
//             id: id,
//             title: data.title,
//             article: data.article,
//             price: data.price,
//             path_images: data.path_images,
//             sex: data.sex,
//             description: data.description,
//             details: data.details,
//             delivery: data.delivery,
//             attributes: data.attributes,
//             available: data.available,
//             categoryId: data.categoryId,
//             materialId: data.materialId
//         });
//
//         reply.status(200).send({
//             success: true,
//             data: OrderMap.toPersistence(product)
//         });
//     } catch (error: any) {
//         console.log('Error:', error.message);
//         const errors = JSON.parse(error.message);
//         reply.status(errors.status).send({
//             success: false,
//             message: errors.message
//         });
//     }
// }
//
// export async function deleteOrderController(request: FastifyRequest<OrderRequest>, reply: FastifyReply) {
//     try {
//         const { id } = request.params;
//         const delOrder = new DeleteOrder(productRepo);
//         const data = await delOrder.execute({ id });
//
//         reply.status(200).send({
//             success: true,
//             data: {
//                 success: data
//             }
//         });
//     } catch (error: any) {
//         console.log('Error:', error.message);
//         const errors = JSON.parse(error.message);
//         reply.status(errors.status).send({
//             success: false,
//             message: errors.message
//         });
//     }
// }
