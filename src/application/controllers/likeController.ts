import {PrismaLikeRepo} from "../../infrastructure/prisma/repo/PrismaLikeRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {GetAllLike} from "../../useCases/like/likeGetAll";
import {GetByIdLike} from "../../useCases/like/likeGetyId";
import {LikeMap} from "../../mappers/LikeMap";
import {CreateLike} from "../../useCases/like/likeCreate";
import {UpdateLike} from "../../useCases/like/likeUpdate";
import {DeleteLike} from "../../useCases/like/likeDelete";

const likeRepo = new PrismaLikeRepo();

export async function getAllLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const { entity_id, entity_type, user_id } = request.query as LikeRequest["Query"]
        const getAllData = new GetAllLike(likeRepo)
        const result =  await getAllData.execute({entity_type: entity_type, entity_id: entity_id, user_id: user_id});
        reply.status(200).send({
            success: true,
            data: result
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

export async function getByIdLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getData = new GetByIdLike(likeRepo)
        const result =  await getData.execute({id: id});

        reply.status(200).send({
            success: true,
            data: result
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

        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
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

        reply.status(200).send({
            success: true,
            data: LikeMap.toPersistence(result)
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

export async function deleteLikeController(request: FastifyRequest<LikeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const deleteData = new DeleteLike(likeRepo)
        const result = await deleteData.execute({id: id})

        reply.status(200).send({
            success: true,
            data: {
                success: result
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