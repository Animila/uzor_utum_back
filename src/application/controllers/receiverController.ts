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

const receiverRepo = new PrismaReceiverRepo();

export async function getAllReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const {token, limit, offset} = request.query as ReceiverRequest['Query']
        const getAllReceiver = new GetAllReceiver(receiverRepo)
        const receivers =  await getAllReceiver.execute(!!limit ? parseInt(limit) : 10, !!offset ? parseInt(offset) : 0, token);
        reply.status(200).send({
            success: true,
            data: receivers.data,
            pagination: {
                totalItems: receivers.count,
                totalPages: Math.ceil(receivers.count / (!!limit ? parseInt(limit) : 10)),
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

export async function getByIdReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getReceiver = new GetByIdReceiver(receiverRepo)
        const receiver =  await getReceiver.execute({id: id});

        reply.status(200).send({
            success: true,
            data: ReceiverMap.toPersistence(receiver)
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


export async function createReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createReceiver = new CreateReceiver(receiverRepo)
        const result =  await createReceiver.execute({
            token: data.token,
            phone: data.phone,
            full_name: data.full_name
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

        reply.status(200).send({
            success: true,
            data: ReceiverMap.toPersistence(receiver)
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

export async function deleteReceiverController(request: FastifyRequest<ReceiverRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delReceiver = new DeleteReceiver(receiverRepo)
        const data = await delReceiver.execute({id: id})

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
