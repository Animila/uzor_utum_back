import {FastifyRequest, FastifyReply, FastifyInstance} from "fastify";
import {GetAllReview} from "../../useCases/review/reviewGetAll";
import {PrismaReviewRepo} from "../../infrastructure/prisma/repo/PrismaReviewRepo";
import {CreateReview} from "../../useCases/review/reviewCreate";
import {ReviewMap} from "../../mappers/ReviewMap";
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {GetByIdProducts} from "../../useCases/product/productGetById";
import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import {ProductMap} from "../../mappers/ProductMap";
import {GetByIdOrder} from "../../useCases/order/orderGetById";
import {PrismaOrderRepo} from "../../infrastructure/prisma/repo/PrismaOrderRepo";
import {OrderMap} from "../../mappers/OrderMap";

const reviewRepo = new PrismaReviewRepo()
const fileRepo = new PrismaFileRepo()
const productRepo = new PrismaProductRepo()
const orderRepo = new PrismaOrderRepo()

export async function getAllReviewsController(request: FastifyRequest<ReviewRequest>, reply: FastifyReply) {
    try {
        const {user_id, old, url, popular, product_id, offset, limit} = request.query as ReviewRequest["Query"]

        const getFiles = new GetAllFile(fileRepo)
        const getAll = new GetAllReview(reviewRepo)
        const getProd = new GetByIdProducts(productRepo, fileRepo)
        const getOrder = new GetByIdOrder(orderRepo)
        const all =  await getAll.execute({old, user_id, popular, product_id, offset: !!offset ? parseInt(offset) : 0, limit: !!limit ? parseInt(limit) : 10});

        for (const item of all.data) {
            const data = await getFiles.execute({limit: 10, offset: 0, entity_id: item.id, entity_type: 'review'})
            item.images = data.data
            const dataProd = await getProd.execute({id: item.product_id})
            item.product = ProductMap.toPersistence(dataProd)
            const dataOrder = await getOrder.execute({id: item.order_id})
            item.order = OrderMap.toPersistence(dataOrder)
        }
        reply.status(200).send({
            success: true,
            data: all.data,
            pagination: {
                totalItems: all.count,
                totalPages: Math.ceil(all.count / (!!limit ? parseInt(limit) : 10)),
                currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                limit: !!limit ? parseInt(limit) : 10
            }
        });
    } catch (error: any) {
        console.log('345678', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function createReviewController(request: FastifyRequest<ReviewRequest>, reply: FastifyReply) {
    try {
        const {product_id, name, rating, text, order_id, url} = request.body

        const createReview = new CreateReview(reviewRepo)
        const all =  await createReview.execute({text, name, rating, product_id, order_id, url});
        reply.status(200).send({
            success: true,
            data: ReviewMap.toPersistence(all)
        });
    } catch (error: any) {
        console.log('345678', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
