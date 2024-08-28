import {PrismaShopRepo} from "../../infrastructure/prisma/repo/PrismaShopRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {ShopMap} from "../../mappers/ShopMap";
import {GetByIdShop} from "../../useCases/shop/shopGetById";
import {CreateShop} from "../../useCases/shop/shopCreate";
import {UpdateShop} from "../../useCases/shop/shopUpdate";
import {DeleteShop} from "../../useCases/shop/shopDelete";
import {GetAllShop} from "../../useCases/shop/shopGetAll";
import {redis} from "../../infrastructure/redis/redis";

const shopRepo = new PrismaShopRepo();

export async function getAllShopController(request: FastifyRequest<ShopRequest>, reply: FastifyReply) {
    try {
        const {limit, offset, q} = request.query as ShopRequest['Query']
        const cacheKey = `shops:${limit}:${offset}`;
        let shopsRes;

        //@ts-ignore
        let shopsCache = await redis.get(cacheKey);

        if (!shopsCache) {
            const getAllShop = new GetAllShop(shopRepo)
            const shops = await getAllShop.execute(!!limit ? parseInt(limit) : 10, !!offset ? parseInt(offset) : 0, q);
            shopsRes = {
                data: shops.data,
                pagination: {
                    totalItems: shops.count,
                    totalPages: Math.ceil(shops.count / (!!limit ? parseInt(limit) : 10)),
                    currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                    limit: !!limit ? parseInt(limit) : 10
                }
            }
            await redis.set(cacheKey, JSON.stringify(shopsRes), 'EX', 3600);

        } else {
            shopsRes = JSON.parse(shopsCache)
        }
        reply.status(200).send({
            success: true,
            data: shopsRes.data,
            pagination: shopsRes.pagination
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

export async function getByIdShopController(request: FastifyRequest<ShopRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const cacheKey = `shop:${id}`;
        let shopRes;

        //@ts-ignore
        let shopCache = await redis.get(cacheKey);

        if (!shopCache) {
            const getShop = new GetByIdShop(shopRepo)
            const shop =  await getShop.execute({id: id});
            shopRes = ShopMap.toPersistence(shop)
            await redis.set(cacheKey, JSON.stringify(shopRes), 'EX', 3600);
        } else {
            shopRes = JSON.parse(shopCache)
        }

        reply.status(200).send({
            success: true,
            data: shopRes
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


export async function createShopController(request: FastifyRequest<ShopRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createShop = new CreateShop(shopRepo)
        const result =  await createShop.execute({
            title: data.title,
            address: data.address,
            longitude: data.longitude,
            latitude: data.latitude,
            email: data.email,
            phones: data.phones,
            times: data.times
        });

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

export async function updateShopController(request: FastifyRequest<ShopRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateShop = new UpdateShop(shopRepo)
        const shop = await updateShop.execute({
            id: id,
            title: data.title,
            address: data.address,
            longitude: data.longitude,
            latitude: data.latitude,
            email: data.email,
            phones: data.phones,
            times: data.times
        });

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: ShopMap.toPersistence(shop)
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

export async function deleteShopController(request: FastifyRequest<ShopRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delShop = new DeleteShop(shopRepo)
        const data = await delShop.execute({id: id})

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
