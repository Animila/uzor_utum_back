import {PrismaSendTypeRepo} from "../../infrastructure/prisma/repo/PrismaSendTypeRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {SendTypeMap} from "../../mappers/SendTypeMap";
import {
    CreateSendType,
    DeleteSendType,
    GetAllSendType,
    GetByIdSendType,
    UpdateSendType
} from "../../useCases/order/sendType";
import {redis} from "../../infrastructure/redis/redis";

const sendTypeRepo = new PrismaSendTypeRepo();

export async function getAllSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const {limit, offset} = request.query as SendTypeRequest['Query']
        const cacheKey = `sendType:${limit}:${offset}`;
        let sendTypeRes;

        //@ts-ignore
        let sendTypeCache = await redis.get(cacheKey);

        if (!sendTypeCache) {
            const getAllSendType = new GetAllSendType(sendTypeRepo)
            const sendTypes = await getAllSendType.execute(!!limit ? parseInt(limit) : 10, !!offset ? parseInt(offset) : 0);
            sendTypeRes = {
                data: sendTypes.data,
                pagination: {
                    totalItems: sendTypes.count,
                    totalPages: Math.ceil(sendTypes.count / (!!limit ? parseInt(limit) : 10)),
                    currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                    limit: !!limit ? parseInt(limit) : 10
                }
            }
            await redis.set(cacheKey, JSON.stringify(sendTypeRes), 'EX', 3600);
        } else {
            sendTypeRes = JSON.parse(sendTypeCache)
        }
        reply.status(200).send({
            success: true,
            data: sendTypeRes.data,
            pagination: sendTypeRes.pagination
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

export async function getByIdSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const cacheKey = `sendType:${id}`;
        let sendTypeRes;

        //@ts-ignore
        let sendTypeCache = await redis.get(cacheKey);

        if (!sendTypeCache) {
            const getSendType = new GetByIdSendType(sendTypeRepo)
            const sendType = await getSendType.execute({id: id});
            sendTypeRes = SendTypeMap.toPersistence(sendType)
            await redis.set(cacheKey, JSON.stringify(sendTypeRes), 'EX', 3600);
        } else {
            sendTypeRes = JSON.parse(sendTypeCache)
        }

        reply.status(200).send({
            success: true,
            data: sendTypeRes
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


export async function createSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createSendType = new CreateSendType(sendTypeRepo)
        const result =  await createSendType.execute({
            title: data.title,
            description: data.description,
            price: data.price
        });

        await redis.flushdb()
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

export async function updateSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateSendType = new UpdateSendType(sendTypeRepo)
        const sendType = await updateSendType.execute({
            id: id,
            title: data.title,
            description: data.description,
            price: data.price
        });

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: SendTypeMap.toPersistence(sendType)
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

export async function deleteSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delSendType = new DeleteSendType(sendTypeRepo)
        const data = await delSendType.execute({id: id})

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                success: data
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
