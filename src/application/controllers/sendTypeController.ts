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

const sendTypeRepo = new PrismaSendTypeRepo();

export async function getAllSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const {limit, offset} = request.query as SendTypeRequest['Query']
        const getAllSendType = new GetAllSendType(sendTypeRepo)
        const sendTypes =  await getAllSendType.execute(!!limit ? parseInt(limit) : 10, !!offset ? parseInt(offset) : 0);
        reply.status(200).send({
            success: true,
            data: sendTypes.data,
            pagination: {
                totalItems: sendTypes.count,
                totalPages: Math.ceil(sendTypes.count / (!!limit ? parseInt(limit) : 10)),
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

export async function getByIdSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getSendType = new GetByIdSendType(sendTypeRepo)
        const sendType =  await getSendType.execute({id: id});

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


export async function createSendTypeController(request: FastifyRequest<SendTypeRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createSendType = new CreateSendType(sendTypeRepo)
        const result =  await createSendType.execute({
            title: data.title,
            description: data.description,
            price: data.price
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
