import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {addItemToCart, changeItemCart, getCartSchema, removeItemCart} from "../schemas/cartSchema";
import {
    addItemToCartController,
    changeItemCartController,
    checkCartController, deleteItemCartController
} from "../../../application/controllers/cartController";

export function registerCartRouting(fastify: FastifyInstance) {
    fastify.get('/carts/check', getCartSchema, async (req: FastifyRequest<CartRequest>, res: FastifyReply) => {
        // получить корзину по токену или юзер ID
        await checkCartController(req, res)
    });

    fastify.post('/carts/add', addItemToCart, async (req: FastifyRequest<ItemCartRequest>, res: FastifyReply) => {
        await addItemToCartController(req, res)
    })

    fastify.put('/carts/update', changeItemCart, async (req: FastifyRequest<ItemCartRequest>, res: FastifyReply) => {
        await changeItemCartController(req, res)
    })

    fastify.delete('/carts/remove', removeItemCart,  async (req: FastifyRequest<ItemCartRequest>, res: FastifyReply) => {
        // убрать товар из корзины
        await deleteItemCartController(req, res)
    })

}
