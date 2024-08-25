import {FastifyReply, FastifyRequest} from "fastify";
import {GetOrderStats} from "../../useCases/stats/getOrderStats";
import {PrismaOrderRepo} from "../../infrastructure/prisma/repo/PrismaOrderRepo";
import {PrismaCertificateRepo} from "../../infrastructure/prisma/repo/PrismaCertificateRepo";

const orderRepo = new PrismaOrderRepo()
const certRepo = new PrismaCertificateRepo()

export async function getOderAll(request: FastifyRequest, reply: FastifyReply) {
    const orderStat = new GetOrderStats(orderRepo,certRepo)
    const data = await orderStat.execute()
    reply.send({
        success: true,
        data: {
            count_order: data.count,
            count_product: data.countProduct,
            price_total: data.totalPrice,
            sales_data: data.salesData,
        }
    })
}
