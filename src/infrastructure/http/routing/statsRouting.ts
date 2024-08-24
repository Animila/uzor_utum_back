import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Roles} from "../../../domain/user/valueObjects/role";

export function registerStatsRouting(fastify: FastifyInstance) {
    // @ts-ignore
    fastify.get('/stats/ordersAll', { schema: { hide: true }  }, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')

    });
    // @ts-ignore
    fastify.get('/stats/productInOrder', { schema: { hide: true }  }, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')

    });
    // @ts-ignore
    fastify.get('/stats/totalCost', { schema: { hide: true }  }, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
    });
}
