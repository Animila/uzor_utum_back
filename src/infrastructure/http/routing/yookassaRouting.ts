import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {getPaymentStatus} from "../../../application/controllers/yookassaControler";

export function registerYookassaRouting(fastify: FastifyInstance) {
    fastify.post('/payment/status', async (req: FastifyRequest, res: FastifyReply) => {
        console.log('POST 45678')
        await getPaymentStatus(req, res)
    });
}
