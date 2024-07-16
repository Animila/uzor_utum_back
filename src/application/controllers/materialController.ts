import {PrismaMaterialRepo} from "../../infrastructure/prisma/repo/PrismaMaterialRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {
    CreateMaterial,
    DeleteMaterial,
    GetAllMaterial,
    GetByIdMaterial,
    UpdateMaterial
} from "../../useCases/product/material";
import {MaterialMap} from "../../mappers/MaterialMap";

const materialRepo = new PrismaMaterialRepo();

export async function getAllMaterialController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getAllMaterial = new GetAllMaterial(materialRepo)
        const results =  await getAllMaterial.execute();
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

export async function getByIdMaterialController(request: FastifyRequest<MaterialRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getMaterial = new GetByIdMaterial(materialRepo)
        const material =  await getMaterial.execute({id: id});

        reply.status(200).send({
            success: true,
            data: MaterialMap.toPersistence(material)
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

export async function createMaterialController(request: FastifyRequest<MaterialRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createService = new CreateMaterial(materialRepo)
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

export async function updateMaterialController(request: FastifyRequest<MaterialRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateMaterial = new UpdateMaterial(materialRepo)
        const material = await updateMaterial.execute({
            id: id,
            title: data.title
        });

        reply.status(200).send({
            success: true,
            data: MaterialMap.toPersistence(material)
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

export async function deleteMaterialController(request: FastifyRequest<MaterialRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delMaterial = new DeleteMaterial(materialRepo)
        const data = await delMaterial.execute({id: id})

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