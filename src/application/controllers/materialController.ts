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
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {redis} from "../../infrastructure/redis/redis";

const materialRepo = new PrismaMaterialRepo();
const fileRepo = new PrismaFileRepo();

export async function getAllMaterialController(request: FastifyRequest<MaterialRequest>, reply: FastifyReply) {
    try {
        const data = request.query as MaterialRequest['Query']
        const cacheKey = `materials:${data.limit}:${data.offset}`;
        let materialsRes: {
            data: any,
            pagination: any
        }

        //@ts-ignore
        let materialsCache = await redis.get(cacheKey);

        if (!materialsCache) {
            const getAllMaterial = new GetAllMaterial(materialRepo)
            const materials = await getAllMaterial.execute(data.limit ? parseInt(data.limit) : undefined, data.offset ? parseInt(data.offset) : undefined);
            const getFiles = new GetAllFile(fileRepo)

            for (const material of materials.data) {
                const data = await getFiles.execute({
                    limit: 10,
                    offset: 0,
                    entity_type: 'material',
                    entity_id: material.id
                });
                material.images = data.data
            }
            materialsRes = {
                data: materials.data,
                pagination: {
                    totalItems: materials.count,
                    totalPages: Math.ceil(materials.count / (data.limit ? parseInt(data.limit) : 10)),
                    currentPage: (data.offset ? parseInt(data.offset) : 0) + 1,
                    limit: data.limit ? parseInt(data.limit) : 10
                }
            }
        } else {
            materialsRes = JSON.parse(materialsCache)
        }
        reply.status(200).send({
            success: true,
            data: materialsRes.data,
            pagination: materialsRes.pagination
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
        const cacheKey = `material:${id}`;
        let materialRes;

        //@ts-ignore
        let materialCache = await redis.get(cacheKey);

        if (!materialCache) {
            const getMaterial = new GetByIdMaterial(materialRepo)
            const material = await getMaterial.execute({id: id});
            const matPer = MaterialMap.toPersistence(material)
            const getFiles = new GetAllFile(fileRepo)
            const dataFile = await getFiles.execute({entity_type: 'material', entity_id: material.getId()});
            matPer.images = dataFile.data
            materialRes = matPer
            await redis.set(cacheKey, JSON.stringify(materialRes), 'EX', 3600);
        } else {
            materialRes = JSON.parse(materialCache)
        }
        reply.status(200).send({
            success: true,
            data: materialRes
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

        await redis.flushdb()
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
        const matPer = MaterialMap.toPersistence(material)
        const getFiles = new GetAllFile(fileRepo)
        const dataFile = await getFiles.execute({entity_type: 'material', entity_id: material.getId()});
        matPer.images = dataFile.data
        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: matPer
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

        await redis.flushdb()
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
