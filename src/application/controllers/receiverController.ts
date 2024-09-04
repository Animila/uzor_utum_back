import {PrismaReceiverRepo} from "../../infrastructure/prisma/repo/PrismaReceiverRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {ReceiverMap} from "../../mappers/ReceiverMap";
import {
    CreateReceiver,
    DeleteReceiver,
    GetAllReceiver,
    GetByIdReceiver,
    UpdateReceiver
} from "../../useCases/order/receiver";
import {redis} from "../../infrastructure/redis/redis";

const receiverRepo = new PrismaReceiverRepo();

export async function getAllReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const {token, limit, offset} = request.query as ReceiverRequest['Query']
        const cacheKey = `receivers:${limit}:${offset}`;
        let receiverRes;

        //@ts-ignore
        let receiverCache = await redis.get(cacheKey);

        if (!receiverCache) {
            const getAllReceiver = new GetAllReceiver(receiverRepo)
            const receivers = await getAllReceiver.execute(!!limit ? parseInt(limit) : 10, !!offset ? parseInt(offset) : 0, token);
            receiverRes = {
                data: receivers.data,
                pagination: {
                    totalItems: receivers.count,
                    totalPages: Math.ceil(receivers.count / (!!limit ? parseInt(limit) : 10)),
                    currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                    limit: !!limit ? parseInt(limit) : 10
                }
            }
            await redis.set(cacheKey, JSON.stringify(receiverRes), 'EX', 3600);
        } else {
            receiverRes = JSON.parse(receiverCache)
        }


        reply.status(200).send({
            success: true,
            data: receiverRes.data,
            pagination: receiverRes.pagination
        });
    } catch (error: any) {
        console.log('receiverControllerGetAll: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function getByIdReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const cacheKey = `receiver:${id}`;
        let receiverRes;

        //@ts-ignore
        let receiverCache = await redis.get(cacheKey);

        if (!receiverCache) {
            const getReceiver = new GetByIdReceiver(receiverRepo)
            const receiver =  await getReceiver.execute({id: id});
            receiverRes = ReceiverMap.toPersistence(receiver)
            await redis.set(cacheKey, JSON.stringify(receiverRes), 'EX', 3600);
        }  else {
            receiverRes = JSON.parse(receiverCache)
        }
        reply.status(200).send({
            success: true,
            data: receiverRes
        });
    } catch (error: any) {
        console.log('receiverControllerGetId: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}


export async function createReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createReceiver = new CreateReceiver(receiverRepo)
        const result =  await createReceiver.execute({
            token: data.token,
            phone: data.phone,
            full_name: data.full_name
        });

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
            }
        });
    } catch (error: any) {
        console.log('receiverControllerCreate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function updateReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateReceiver = new UpdateReceiver(receiverRepo)
        const receiver = await updateReceiver.execute({
            id: id,
            token: data.token,
            full_name: data.full_name,
            phone: data.phone
        });
        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: ReceiverMap.toPersistence(receiver)
        });
    } catch (error: any) {
        console.log('receiverControllerUpdate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function deleteReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delReceiver = new DeleteReceiver(receiverRepo)
        const data = await delReceiver.execute({id: id})
        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('receiverControllerDelete: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
