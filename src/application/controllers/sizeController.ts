import {FastifyReply, FastifyRequest} from "fastify";
import {SizeMap} from "../../mappers/SizeMap";
import {CreateSize, DeleteSize, GetAllSize, GetByIdSize, UpdateSize} from "../../useCases/product/size";
import {PrismaSizesRepo} from "../../infrastructure/prisma/repo/PrismaSizesRepo";

const sizeRepo = new PrismaSizesRepo();

export async function getAllSizeController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getAllSize = new GetAllSize(sizeRepo)
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
        const getSize = new GetByIdSize(sizeRepo)
        const size =  await getSize.execute({id: id});

        reply.status(200).send({
            success: true,
            data: SizeMap.toPersistence(size)
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

export async function createSizeController(request: FastifyRequest<MaterialRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createService = new CreateSize(sizeRepo)
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
        const updateSize = new UpdateSize(sizeRepo)
        const size = await updateSize.execute({
            id: id,
            title: data.title
        });

        reply.status(200).send({
            success: true,
            data: SizeMap.toPersistence(size)
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
        const delSize = new DeleteSize(sizeRepo)
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