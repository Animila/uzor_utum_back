import {PrismaSizeRepo} from "../../infrastructure/prisma/repo/PrismaSizeRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {
    CreateSize,
    DeleteSize,
    GetAllSize,
    GetByIdSize,
    UpdateSize
} from "../../useCases/product/size";
import {SizeMap} from "../../mappers/SizeMap";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {GetAllFile} from "../../useCases/file/fileGetAll";

const materialRepo = new PrismaSizeRepo();
const fileRepo = new PrismaFileRepo();

export async function getAllSizeController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getAllSize = new GetAllSize(materialRepo)
        const sizes =  await getAllSize.execute();
        const getFiles = new GetAllFile(fileRepo)
        for(const size of sizes) {
            size.images = await getFiles.execute({entity_id: size.id, entity_type: 'size'})
        }
        reply.status(200).send({
            success: true,
            data: sizes
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

export async function getByIdSizeController(request: FastifyRequest<SizeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getSize = new GetByIdSize(materialRepo)
        const size =  await getSize.execute({id: id});
        const sizePer = SizeMap.toPersistence(size)
        const getFiles = new GetAllFile(fileRepo)
        sizePer.images = await getFiles.execute({entity_type: 'size', entity_id: size.getId()})

        reply.status(200).send({
            success: true,
            data: sizePer
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

export async function createSizeController(request: FastifyRequest<SizeRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createService = new CreateSize(materialRepo)
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

export async function updateSizeController(request: FastifyRequest<SizeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateSize = new UpdateSize(materialRepo)
        const size = await updateSize.execute({
            id: id,
            title: data.title
        });
        const sizePer = SizeMap.toPersistence(size)
        const getFiles = new GetAllFile(fileRepo)
        sizePer.images = await getFiles.execute({entity_type: 'size', entity_id: size.getId()})

        reply.status(200).send({
            success: true,
            data: sizePer
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

export async function deleteSizeController(request: FastifyRequest<SizeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delSize = new DeleteSize(materialRepo)
        const data = await delSize.execute({id: id})

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