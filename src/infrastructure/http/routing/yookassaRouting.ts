import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {getPaymentStatus} from "../../../application/controllers/yookassaControler";

export function registerYookassaRouting(fastify: FastifyInstance) {
    fastify.post('/yookassa/check',{
        schema: {
            //@ts-ignore
           hide: true
        }
    }, async (req: FastifyRequest, res: FastifyReply) => {
        console.log('45678')
        await getPaymentStatus(req, res)
    });
}
