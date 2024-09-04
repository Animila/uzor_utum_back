import {PrismaLikeRepo} from "../../infrastructure/prisma/repo/PrismaLikeRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {GetAllLike} from "../../useCases/like/likeGetAll";
import {GetByIdLike} from "../../useCases/like/likeGetyId";
import {LikeMap} from "../../mappers/LikeMap";
import {CreateLike} from "../../useCases/like/likeCreate";
import {UpdateLike} from "../../useCases/like/likeUpdate";
import {DeleteLike} from "../../useCases/like/likeDelete";
import {GetByIdNews} from "../../useCases/news/newsGetById";
import {PrismaNewsRepo} from "../../infrastructure/prisma/repo/PrismaNewsRepo";
import {NewsMap} from "../../mappers/NewsMap";
import {GetByIdProducts} from "../../useCases/product/productGetById";
import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {ProductMap} from "../../mappers/ProductMap";
import {GetByIdReview} from "../../useCases/review/reviewById";
import {PrismaReviewRepo} from "../../infrastructure/prisma/repo/PrismaReviewRepo";
import {ReviewMap} from "../../mappers/ReviewMap";
import {redis} from "../../infrastructure/redis/redis";

const likeRepo = new PrismaLikeRepo();
const newsRepo = new PrismaNewsRepo()
const prodRepo = new PrismaProductRepo()
const fileRepo = new PrismaFileRepo()
const revRepo = new PrismaReviewRepo()

export async function getAllLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const {
            entity_id,
            entity_type,
            user_id,
            obj_type,
            limit = "10",
            offset = "0", } = request.query as LikeRequest["Query"]


        const getAllData = new GetAllLike(likeRepo)
        const getNews = new GetByIdNews(newsRepo, fileRepo)
        const getProduct = new GetByIdProducts(prodRepo, fileRepo)
        const getReview = new GetByIdReview(revRepo, fileRepo)

        const result =  await getAllData.execute({
            entity_type: entity_type,
            entity_id: entity_id,
            user_id: user_id,
            type: obj_type,
            limit: parseInt(limit),
            offset: parseInt(offset)});
        for(const item of result.data) {
            switch (item.entity_type) {
                case 'news':
                    const newsData = await getNews.execute({id: item.entity_id})
                    item.entity = NewsMap.toPersistence(newsData)
                    break;
                case 'product':
                    const prodData = await getProduct.execute({id: item.entity_id})
                    item.entity = ProductMap.toPersistence(prodData)
                    break
                case 'review':
                    const reviewData = await getReview.execute({id: item.entity_id})
                    item.entity = ReviewMap.toPersistence(reviewData)
                    break
            }
        }
        const totalPages = Math.ceil(result.count / parseInt(limit));

        reply.status(200).send({
            success: true,
            data: result.data,
            pagination: {
                totalItems: result.count,
                totalPages: totalPages,
                currentPage: parseInt(offset) + 1,
                limit: parseInt(limit)
            }
        });
    } catch (error: any) {
        console.log('likeControllerGetAll: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function getByIdLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getData = new GetByIdLike(likeRepo)
        const getNews = new GetByIdNews(newsRepo, fileRepo)
        const getProduct = new GetByIdProducts(prodRepo, fileRepo)
        const getReview = new GetByIdReview(revRepo, fileRepo)

        const result =  await getData.execute({id: id});


        switch (result.entity_type) {
            case 'news':
                const newsData = await getNews.execute({id: result.entity_id})
                result.entity = NewsMap.toPersistence(newsData)
                break;
            case 'product':
                const prodData = await getProduct.execute({id: result.entity_id})
                result.entity = ProductMap.toPersistence(prodData)
                break
            case 'review':
                const reviewData = await getReview.execute({id: result.entity_id})
                result.entity = ReviewMap.toPersistence(reviewData)
                break
        }

        reply.status(200).send({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.log('likeControllerGetId: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}


export async function createLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createData = new CreateLike(likeRepo)
        const result =  await createData.execute({
            entity_id: data.entity_id,
            entity_type: data.entity_type,
            type: data.type,
            user_id: data.user_id
        });

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
            }
        });
    } catch (error: any) {
        console.log('likeControllerCreate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function updateLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateData = new UpdateLike(likeRepo)
        const result = await updateData.execute({
            id: id,
            entity_type: data.entity_type,
            entity_id: data.entity_id,
            user_id: data.user_id,
            type: data.type,
        });

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: LikeMap.toPersistence(result)
        });
    } catch (error: any) {
        console.log('likeControllerUpdate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function deleteLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const deleteData = new DeleteLike(likeRepo)
        const result = await deleteData.execute({id: id})

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                success: result
            }
        });
    } catch (error: any) {
        console.log('likeControllerDelete: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
