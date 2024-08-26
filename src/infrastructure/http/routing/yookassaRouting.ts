import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {getPaymentStatus} from "../../../application/controllers/yookassaControler";

export function registerYookassaRouting(fastify: FastifyInstance) {
    fastify.post('/payment/status',{
        schema: {
            // @ts-ignore
            hide: true,
        }
    }, async (req: FastifyRequest, res: FastifyReply) => {
        await getPaymentStatus(req, res)
    });
}
