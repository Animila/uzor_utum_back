import {PrismaDeliveryZoneRepo} from "../../infrastructure/prisma/repo/PrismaDeliveryZoneRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {DeliveryZoneMap} from "../../mappers/DeliveryZoneMap";
import {redis} from "../../infrastructure/redis/redis";
import {GetAllDeliveryZone} from "../../useCases/deliveryzone/deliveryZoneGetAll";
import {GetByIdDeliveryZone} from "../../useCases/deliveryzone/deliveryZoneGetById";
import {CreateDeliveryZone} from "../../useCases/deliveryzone/deliveryZoneCreate";
import {UpdateDeliveryZone} from "../../useCases/deliveryzone/deliveryZoneUpdate";
import {DeleteDeliveryZone} from "../../useCases/deliveryzone/deliveryZoneDelete";
import * as turf from "@turf/turf";
import * as repl from "node:repl";

const DeliveryZoneRepo = new PrismaDeliveryZoneRepo();

export async function getAllDeliveryZoneController(request: FastifyRequest<DeliveryZoneRequest>, reply: FastifyReply) {
    try {
        const {limit, offset} = request.query as DeliveryZoneRequest['Query']
        const cacheKey = `DeliveryZones:${limit}:${offset}`;
        let DeliveryZonesRes;

        //@ts-ignore
        let DeliveryZonesCache = await redis.get(cacheKey);

        if (!DeliveryZonesCache) {
            const getAllDeliveryZone = new GetAllDeliveryZone(DeliveryZoneRepo)
            const DeliveryZones = await getAllDeliveryZone.execute(!!limit ? parseInt(limit) : 10, !!offset ? parseInt(offset) : 0);
            DeliveryZonesRes = {
                data: DeliveryZones.data,
                pagination: {
                    totalItems: DeliveryZones.count,
                    totalPages: Math.ceil(DeliveryZones.count / (!!limit ? parseInt(limit) : 10)),
                    currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                    limit: !!limit ? parseInt(limit) : 10
                }
            }
            await redis.set(cacheKey, JSON.stringify(DeliveryZonesRes), 'EX', 3600);

        } else {
            DeliveryZonesRes = JSON.parse(DeliveryZonesCache)
        }
        reply.status(200).send({
            success: true,
            data: DeliveryZonesRes.data,
            pagination: DeliveryZonesRes.pagination
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

export async function getByIdDeliveryZoneController(request: FastifyRequest<DeliveryZoneRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const cacheKey = `DeliveryZone:${id}`;
        let DeliveryZoneRes;

        //@ts-ignore
        let DeliveryZoneCache = await redis.get(cacheKey);

        if (!DeliveryZoneCache) {
            const getDeliveryZone = new GetByIdDeliveryZone(DeliveryZoneRepo)
            const DeliveryZone =  await getDeliveryZone.execute({id: id});
            DeliveryZoneRes = DeliveryZoneMap.toPersistence(DeliveryZone)
            await redis.set(cacheKey, JSON.stringify(DeliveryZoneRes), 'EX', 3600);
        } else {
            DeliveryZoneRes = JSON.parse(DeliveryZoneCache)
        }

        reply.status(200).send({
            success: true,
            data: DeliveryZoneRes
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


export async function createDeliveryZoneController(request: FastifyRequest<DeliveryZoneRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        if(data.title.length <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'title',
                        message: 'Не должно быть пустым'
                    }
                ]
            }))

        if(data.price <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'price',
                        message: 'Должно быть больше 0'
                    }
                ]
            }))

        if(data.description.length <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'description',
                        message: 'Не должно быть пустым'
                    }
                ]
            }))

        console.log('234')

        const createDeliveryZone = new CreateDeliveryZone(DeliveryZoneRepo)
        const result =  await createDeliveryZone.execute({
            title: data.title,
            price: data.price,
            polygon: data.polygon,
            description: data.description,
        })

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

export async function updateDeliveryZoneController(request: FastifyRequest<DeliveryZoneRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateDeliveryZone = new UpdateDeliveryZone(DeliveryZoneRepo)
        const DeliveryZone = await updateDeliveryZone.execute({
            id: id,
            title: data.title,
            price: data.price,
            polygon: data.polygon,
            description: data.description,
        });

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: DeliveryZoneMap.toPersistence(DeliveryZone)
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

export async function deleteDeliveryZoneController(request: FastifyRequest<DeliveryZoneRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delDeliveryZone = new DeleteDeliveryZone(DeliveryZoneRepo)
        const data = await delDeliveryZone.execute({id: id})

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

export async function checkgeoCheckController(request: FastifyRequest<DeliveryZoneRequest>, reply: FastifyReply) {
        const { longitude, latitude } = request.params;
        const getAllDeliveryZone = new GetAllDeliveryZone(DeliveryZoneRepo)

        if (!longitude || !latitude) {
            reply.status(400).send({ success: false,
                message: [
                    !longitude && {
                        type: 'longitude',
                        message: "Долгота обязательна"
                    },
                    !latitude && {
                        type: 'latitude',
                        message: "Широта обязательна"
                    }
                ]});
            return;
        }

        try {
            const allZones = await getAllDeliveryZone.execute(100, 0); // Загрузите все зоны
            const point = turf.point([parseFloat(longitude), parseFloat(latitude)]);


            console.log(allZones)
            console.log(point)

            for (const zone of allZones.data) {
                // Добавляем первую точку в конец массива, чтобы замкнуть полигон
                const closedPolygon = [...zone.polygon, zone.polygon[0]];
                const polygon = turf.polygon([closedPolygon]);

                if (turf.booleanPointInPolygon(point, polygon)) {
                    reply.status(200).send({
                        success: true,
                        data: { price: zone.price }
                    });
                    return;
                }
            }

            reply.status(404).send({ message: "Зона не найдена" });
        } catch (error: any) {
            console.log(error)
            reply.status(500).send({ message: "Ошибка сервера", error: error.message });
        }
}
