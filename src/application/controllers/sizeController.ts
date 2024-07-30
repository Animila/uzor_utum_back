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

const materialRepo = new PrismaSizeRepo();

export async function getAllSizeController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getAllSize = new GetAllSize(materialRepo)
        const results =  await getAllSize.execute();
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

export async function getByIdSizeController(request: FastifyRequest<SizeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getSize = new GetByIdSize(materialRepo)
        const material =  await getSize.execute({id: id});

        reply.status(200).send({
            success: true,
            data: SizeMap.toPersistence(material)
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
        const material = await updateSize.execute({
            id: id,
            title: data.title
        });

        reply.status(200).send({
            success: true,
            data: SizeMap.toPersistence(material)
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