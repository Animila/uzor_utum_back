import fastify, { FastifyReply, FastifyRequest} from "fastify";
import {PrismaBonusRepository} from "../../infrastructure/prisma/repo/PrismaBonusRepository";
import {CreateBonus} from "../../useCases/bonus/bonusCreate";
import {BonusMap} from "../../mappers/BonusMap";
import {GetBySumUserBonus} from "../../useCases/bonus/bonusGetSumUser";
import {GetAllBonus} from "../../useCases/bonus/bonusGetAll";
import {UpdateBonus} from "../../useCases/bonus/bonusUpdate";
import {GetByIdBonus} from "../../useCases/bonus/bonusGetId";
import {DeleteBonus} from "../../useCases/bonus/bonusDelete";
import {redis} from "../../infrastructure/redis/redis";
import {Roles} from "../../domain/user/valueObjects/role";

const bonusRepo = new PrismaBonusRepository()

export async function createBonusController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    const data = request.body;
    try {
        const createData = new CreateBonus(bonusRepo);
        const result = await createData.execute({
            type: data.type,
            description: data.description,
            count: data.count,
            created_at: data.created_at,
            user_id: data.user_id,
        });
        await redis.flushdb()
        reply.status(201).send({
            success: true,
            data: BonusMap.toPersistence(result)
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function getAllBonusController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    try {
        const {limit = "10", offset = "0", old = false, user_id } = request.query as BonusRequest["Query"]
        await request.jwtVerify()
        //@ts-ignore
        if(request.user.data.role !== Roles.admin && request.user.data.user_id !== user_id) return reply.status(403).send('Not authorized')
        const getData = new GetAllBonus(bonusRepo)
        const allData = await getData.execute({limit: parseInt(limit), offset: parseInt(offset), old: old,  user_id: user_id})

        const cacheKey = `bonuses_${limit}_${offset}_${old}_${user_id}`;
        //@ts-ignore
        let bonuses = await redis.get(cacheKey);

        if (!bonuses) {
            const getData = new GetAllBonus(bonusRepo);
            const allData = await getData.execute({
                limit: parseInt(limit),
                offset: parseInt(offset),
                old: old,
                user_id: user_id,
            });

            bonuses = JSON.stringify(allData.data);
            //@ts-ignore
            await redis.set(cacheKey, bonuses, "EX", 3600); // Кэшируем на 1 час


            reply.status(200).send({
                success: true,
                data: bonuses,
                pagination: {
                    totalItems: allData.count,
                    totalPages: Math.ceil(allData.count / (!!limit ? parseInt(limit) : 10)),
                    currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                    limit: !!limit ? parseInt(limit) : 10
                }
            });
        } else {
            reply.status(200).send({
                success: true,
                data: JSON.parse(bonuses),
                pagination: {
                    totalItems: allData.count,
                    totalPages: Math.ceil(allData.count / (!!limit ? parseInt(limit) : 10)),
                    currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                    limit: !!limit ? parseInt(limit) : 10
                }
            });
        }
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function getBonusesUserController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    try {
        const { user_id } = request.params
        const {limit = "10", offset = "0" } = request.query as BonusRequest["Query"]
        //@ts-ignore
        if(request.user.data.role != Roles.admin && request.user.data.user_id !== user_id) return reply.status(403).send('Not authorized')
        const getData = new GetAllBonus(bonusRepo)
        const allData = await getData.execute({user_id, limit: !!limit ? parseInt(limit) : 10, offset: !!offset ? parseInt(offset) : 0})

        reply.status(200).send({
            success: true,
            data: allData.data,
            pagination: {
                totalItems: allData.count,
                totalPages: Math.ceil(allData.count / (!!limit ? parseInt(limit) : 10)),
                currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                limit: !!limit ? parseInt(limit) : 10
            }
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function getByIdBonusController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const getData = new GetByIdBonus(bonusRepo);
        const data = await getData.execute({ id });
        reply.status(200).send({
            success: true,
            data: BonusMap.toPersistence(data)
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function updateBonusController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const data = request.body || {};
        const updateData = new UpdateBonus(bonusRepo);
        const result = await updateData.execute({
            id: id,
            type: data.type,
            description: data.description,
            count: data.count,
            user_id: data.user_id,
        });
        await redis.flushdb()

        reply.status(200).send({
            success: true,
            data: BonusMap.toPersistence(result)
        });

    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function deleteBonusController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const delData = new DeleteBonus(bonusRepo);
        const data = await delData.execute({ id });
        await redis.flushdb()

        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function getByUserSumBonusController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    try {
        const { user_id } = request.params;
        const getData = new GetBySumUserBonus(bonusRepo);
        const data = await getData.execute({ user_id: user_id });
        reply.status(200).send({
            success: true,
            data: data
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}
