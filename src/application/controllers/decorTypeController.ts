import {FastifyReply, FastifyRequest} from "fastify";
import {PrismaDecorTypeRepo} from "../../infrastructure/prisma/repo/PrismaDecorTypeRepo";
import {
    CreateDecorationType,
    DeleteDecorationType,
    GetAllDecorationType,
    GetByIdDecorationType,
    UpdateDecorationType
} from "../../useCases/product/decorType";
import {DecorationTypeMap} from "../../mappers/DecorationTypeMap";

const decorTypeRepo = new PrismaDecorTypeRepo();

export async function getAllDecorTypeController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getAllDecorType = new GetAllDecorationType(decorTypeRepo)
        const results =  await getAllDecorType.execute();
        reply.status(200).send({
            success: true,
            data: results
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

export async function getByIdDecorTypeController(request: FastifyRequest<DecorationTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getDecorType = new GetByIdDecorationType(decorTypeRepo)
        const decorType =  await getDecorType.execute({id: id});

        reply.status(200).send({
            success: true,
            data: DecorationTypeMap.toPersistence(decorType)
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

export async function createDecorTypeController(request: FastifyRequest<DecorationTypeRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createDecorationType = new CreateDecorationType(decorTypeRepo)
        const result =  await createDecorationType.execute({title: data.title!});

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

export async function updateDecorTypeController(request: FastifyRequest<DecorationTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateDecorType = new UpdateDecorationType(decorTypeRepo)
        const decorType = await updateDecorType.execute({
            id: id,
            title: data.title
        });

        reply.status(200).send({
            success: true,
            data: DecorationTypeMap.toPersistence(decorType)
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

export async function deleteDecorTypeController(request: FastifyRequest<DecorationTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delDecorType = new DeleteDecorationType(decorTypeRepo)
        const data = await delDecorType.execute({id: id})

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