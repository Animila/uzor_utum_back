import {PrismaDecorateRepo} from "../../infrastructure/prisma/repo/PrismaDecorateRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {
    CreateDecorate,
    DeleteDecorate,
    GetAllDecorate,
    GetByIdDecorate,
    UpdateDecorate
} from "../../useCases/product/decorate";
import {DecorateMap} from "../../mappers/DecorateMap";

const materialRepo = new PrismaDecorateRepo();

export async function getAllDecorateController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getAllDecorate = new GetAllDecorate(materialRepo)
        const results =  await getAllDecorate.execute();
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

export async function getByIdDecorateController(request: FastifyRequest<DecorateRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getDecorate = new GetByIdDecorate(materialRepo)
        const material =  await getDecorate.execute({id: id});

        reply.status(200).send({
            success: true,
            data: DecorateMap.toPersistence(material)
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

export async function createDecorateController(request: FastifyRequest<DecorateRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createService = new CreateDecorate(materialRepo)
        const result =  await createService.execute({title: data.title!});

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

export async function updateDecorateController(request: FastifyRequest<DecorateRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateDecorate = new UpdateDecorate(materialRepo)
        const material = await updateDecorate.execute({
            id: id,
            title: data.title
        });

        reply.status(200).send({
            success: true,
            data: DecorateMap.toPersistence(material)
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

export async function deleteDecorateController(request: FastifyRequest<DecorateRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delDecorate = new DeleteDecorate(materialRepo)
        const data = await delDecorate.execute({id: id})

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