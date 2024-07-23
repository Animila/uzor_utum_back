import {FastifyReply, FastifyRequest} from "fastify";
import {PrismaPromoCodeRepo} from "../../infrastructure/prisma/repo/PrismaPromocodeRepo";
import {GetAllPromoCode} from "../../useCases/promocode/promocodeGetAll";
import {GetByIdPromoCode} from "../../useCases/promocode/promocodeGetId";
import {PromoCodeMap} from "../../mappers/PromoCodeMap";
import {UpdatePromoCode} from "../../useCases/promocode/promocodeUpdate";
import {DeletePromoCode} from "../../useCases/promocode/promocodeDelete";
import {CreatePromoCode} from "../../useCases/promocode/promocodeCreate";
import {GetByCodePromoCode} from "../../useCases/promocode/promocodeGetCode";

const promoCodeRepo = new PrismaPromoCodeRepo()

export async function createPromoCodeController(request: FastifyRequest<PromoCodeRequest>, reply: FastifyReply) {
    const data = request.body;


    try {
        const createData = new CreatePromoCode(promoCodeRepo);
        const result = await createData.execute(data);
        reply.status(201).send({
            success: true,
            data: PromoCodeMap.toPersistence(result)
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

export async function getAllPromoCodeController(request: FastifyRequest<PromoCodeRequest>, reply: FastifyReply) {
    try {
        const getData = new GetAllPromoCode(promoCodeRepo)
        const allData = await getData.execute()
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

export async function getByIdPromoCodeController(request: FastifyRequest<PromoCodeRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const getData = new GetByIdPromoCode(promoCodeRepo);
        const data = await getData.execute({ id });
        reply.status(200).send({
            success: true,
            data: PromoCodeMap.toPersistence(data)
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

export async function updatePromoCodeController(request: FastifyRequest<PromoCodeRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const data = request.body || {};
        const updateData = new UpdatePromoCode(promoCodeRepo);
        const result = await updateData.execute({
            id: id,
            code: data.code,
            description: data.description,
            active: data.active,
            discount: data.discount,
            valid_from: data.valid_from,
            valid_to: data.valid_to,
        });

        reply.status(200).send({
            success: true,
            data: PromoCodeMap.toPersistence(result)
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

export async function deletePromoCodeController(request: FastifyRequest<PromoCodeRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const delData = new DeletePromoCode(promoCodeRepo);
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

export async function getByCodePromoCodeController(request: FastifyRequest<PromoCodeRequest>, reply: FastifyReply) {
    try {
        const { code } = request.body;
        const getData = new GetByCodePromoCode(promoCodeRepo);
        const data = await getData.execute({ code });
        reply.status(200).send({
            success: true,
            data: PromoCodeMap.toPersistence(data)
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
