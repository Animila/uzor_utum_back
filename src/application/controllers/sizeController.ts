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
import {redis} from "../../infrastructure/redis/redis";

const materialRepo = new PrismaSizeRepo();
const fileRepo = new PrismaFileRepo();

export async function getAllSizeController(request: FastifyRequest<SizeRequest>, reply: FastifyReply) {
    try {
        const data = request.query as SizeRequest['Query'];
        const cacheKey = `sizes:${data.limit}:${data.offset}`;
        let sizeRes: {
            data: any,
            pagination: any
        }

        //@ts-ignore
        let sizeCache = await redis.get(cacheKey);

        if (!sizeCache) {
            const getAllSize = new GetAllSize(materialRepo)
            const sizes =  await getAllSize.execute(data.limit ? parseInt(data.limit) : undefined, data.offset ? parseInt(data.offset) : undefined);
            const getFiles = new GetAllFile(fileRepo)
            for(const size of sizes.data) {
                const data = await getFiles.execute({limit: 10, offset: 0, entity_id: size.id, entity_type: 'size'})
                size.images = data.data
            }

            sizeRes = {
                data: sizes.data,
                pagination: {
                    totalItems: sizes.count,
                    totalPages: Math.ceil(sizes.count / (data.limit ? parseInt(data.limit) : 10)),
                    currentPage: (data.offset ? parseInt(data.offset) : 0) + 1 ,
                    limit: data.limit ? parseInt(data.limit) : 10
                }
            }
            await redis.set(cacheKey, JSON.stringify(sizeRes), 'EX', 3600);
        } else {
            sizeRes = JSON.parse(sizeCache);
        }

        reply.status(200).send({
            success: true,
            data: sizeRes.data,
            pagination: sizeRes.pagination
        });
    } catch (error: any) {
        console.log('sizeControllerGetAll: ', error.message)
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
        const cacheKey = `size:${id}`;
        let sizeRes;

        //@ts-ignore
        let sizeCache = await redis.get(cacheKey);

        if (!sizeCache) {
            const getSize = new GetByIdSize(materialRepo)
            const size = await getSize.execute({id: id});
            const sizePer = SizeMap.toPersistence(size)
            const getFiles = new GetAllFile(fileRepo)
            const dataFile = await getFiles.execute({entity_type: 'size', entity_id: size.getId()})
            sizePer.images = dataFile.data
            sizeRes = sizePer
            await redis.set(cacheKey, JSON.stringify(sizeRes), 'EX', 3600);
        } else {
            sizeRes = JSON.parse(sizeCache)
        }
        reply.status(200).send({
            success: true,
            data: sizeRes
        });
    } catch (error: any) {
        console.log('sizeControllerGetId: ', error.message)
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

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
            }
        });
    } catch (error: any) {
        console.log('sizeControllerCreate: ', error.message)
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
        const dataFile = await getFiles.execute({entity_type: 'size', entity_id: size.getId()})
        sizePer.images = dataFile.data
        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: sizePer
        });
    } catch (error: any) {
        console.log('sizeControllerUpdate: ', error.message)
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

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('sizeControllerDelete: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
