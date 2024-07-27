import {FastifyReply, FastifyRequest} from "fastify";
import {PrismaBonusRepository} from "../../infrastructure/prisma/repo/PrismaBonusRepository";
import {CreateBonus} from "../../useCases/bonus/bonusCreate";
import {BonusMap} from "../../mappers/BonusMap";
import {GetBySumUserBonus} from "../../useCases/bonus/bonusGetSumUser";
import {GetAllBonus} from "../../useCases/bonus/bonusGetAll";
import {UpdateBonus} from "../../useCases/bonus/bonusUpdate";
import {GetByIdBonus} from "../../useCases/bonus/bonusGetId";
import {DeleteBonus} from "../../useCases/bonus/bonusDelete";

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
        const getData = new GetAllBonus(bonusRepo)
        const allData = await getData.execute({ })
        reply.status(200).send({
            success: true,
            data: allData
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

export async function getBonusesUserController(request: FastifyRequest<BonusRequest>, reply: FastifyReply) {
    try {
        const { user_id } = request.params
        const getData = new GetAllBonus(bonusRepo)
        const allData = await getData.execute({user_id})
        reply.status(200).send({
            success: true,
            data: allData
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
