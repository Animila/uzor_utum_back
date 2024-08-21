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
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {GetAllFile} from "../../useCases/file/fileGetAll";

const materialRepo = new PrismaDecorateRepo();
const fileRepo = new PrismaFileRepo();

export async function getAllDecorateController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const data = request.query as DecorateRequest['Query']
        const getAllDecorate = new GetAllDecorate(materialRepo)
        const decors =  await getAllDecorate.execute(data.limit ? parseInt(data.limit) : undefined, data.offset ? parseInt(data.offset) : undefined);
        const getFiles = new GetAllFile(fileRepo)
        for(const decor of decors.data) {
            const data = await getFiles.execute({limit: 10, offset: 0, entity_id: decor.id, entity_type: 'decorate'})
            decor.images = data.data
        }
        reply.status(200).send({
            success: true,
            data: decors.data,
            pagination: {
                totalItems: decors.count,
                totalPages: Math.ceil(decors.count / (data.limit ? parseInt(data.limit) : 10)),
                currentPage: (data.offset ? parseInt(data.offset) : 0) + 1,
                limit: data.limit ? parseInt(data.limit) : 10
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

export async function getByIdDecorateController(request: FastifyRequest<DecorateRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getDecorate = new GetByIdDecorate(materialRepo)
        const decor =  await getDecorate.execute({id: id});
        const decorPer = DecorateMap.toPersistence(decor)
        const getFiles = new GetAllFile(fileRepo)
        const dataFile = await getFiles.execute({entity_id: decor.getId(), entity_type: 'decorate'})
        decorPer.images = dataFile.data
        reply.status(200).send({
            success: true,
            data: decorPer
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
        const decor = await updateDecorate.execute({
            id: id,
            title: data.title
        });
        const decorPer = DecorateMap.toPersistence(decor)
        const getFiles = new GetAllFile(fileRepo)
        const dataFile = await getFiles.execute({entity_id: decor.getId(), entity_type: 'decorate'})
        decorPer.images = dataFile.data
        reply.status(200).send({
            success: true,
            data: decorPer
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
