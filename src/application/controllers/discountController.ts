import {PrismaDiscountRepo} from "../../infrastructure/prisma/repo/PrismaDiscountRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {CreateDiscount} from "../../useCases/discount/discountCreate";
import {DiscountMap} from "../../mappers/DiscountMap";
import {GetByIdDiscount} from "../../useCases/discount/discountGetById";
import {UpdateDiscount} from "../../useCases/discount/discountUpdate";
import {DeleteDiscount} from "../../useCases/discount/discountDelete";
import {GetByProductIdDiscount} from "../../useCases/discount/discountGetByProductId";
import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import {GetByIdProducts} from "../../useCases/product/productGetById";

const repository = new PrismaDiscountRepo()
const prodRepo = new PrismaProductRepo()

export async function createDiscountController(request: FastifyRequest<DiscountRequest>, reply: FastifyReply) {
    const data = request.body;

    try {
        const getData = new GetByIdProducts(prodRepo)
        await getData.execute({id: data.product_id})
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
        return
    }

    try {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        const createData = new CreateDiscount(repository)
        const result = await createData.execute({
            product_id: data.product_id,
            activated: data.activated,
            percentage: data.percentage,
            start_date: startDate,
            end_date: endDate
        });

        reply.status(201).send({
            success: true,
            data: DiscountMap.toPersistence(result)
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

export async function getByIdDiscountController(request: FastifyRequest<DiscountRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const getData = new GetByIdDiscount(repository);
        const data = await getData.execute({ id });

        reply.status(200).send({
            success: true,
            data: DiscountMap.toPersistence(data)
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

export async function getByProductIdDiscountController(request: FastifyRequest<DiscountRequest>, reply: FastifyReply) {
    try {
        const { product_id } = request.params;
        const getData = new GetByProductIdDiscount(repository);
        const data = await getData.execute({ product_id });

        reply.status(200).send({
            success: true,
            data: DiscountMap.toPersistence(data)
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

export async function updateDiscountController(request: FastifyRequest<DiscountRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const data = request.body || {};
        const updateData = new UpdateDiscount(repository);
        const result = await updateData.execute({
            id: id,
            product_id: data.product_id,
            activated: data.activated,
            percentage: data.percentage,
            start_date: data.start_date,
            end_date: data.end_date
        });

        reply.status(200).send({
            success: true,
            data: DiscountMap.toPersistence(result)
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

export async function deleteDiscountController(request: FastifyRequest<DiscountRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const delData = new DeleteDiscount(repository);
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
