import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {getCartSchema} from "../schemas/cartSchema";
import {checkCartController} from "../../../application/controllers/cartController";

export function registerCartRouting(fastify: FastifyInstance) {
    fastify.get('/carts/check', getCartSchema, async (req: FastifyRequest<CartRequest>, res: FastifyReply) => {
        // получить корзину по токену или юзер ID
        await checkCartController(req, res)
    });

    // fastify.post('/carts/:token/add', async (req: FastifyRequest, res: FastifyReply) => {
    //     // добавить по
    // })

}
