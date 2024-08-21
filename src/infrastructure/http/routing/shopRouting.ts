import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createShopSchema,
    deleteShopSchema,
    getAllShopSchema,
    getShopSchema,
    updateShopSchema
} from "../schemas/shopSchema";
import {
    createShopController, deleteShopController,
    getAllShopController,
    getByIdShopController
} from "../../../application/controllers/shopController";


export function registerShopRouting(fastify: FastifyInstance) {
    fastify.get('/shop', getAllShopSchema, async (req: FastifyRequest<ShopRequest>, res) => {
        await getAllShopController(req, res)
    });
    fastify.get('/shop/:id',getShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await getByIdShopController(req, res)
        // получить заказ по id
    });
    fastify.post('/shop',createShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await createShopController(req, res)
        // создать заказ
    });
    fastify.put('/shop/:id',updateShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await getByIdShopController(req, res)
        // получить заказ по id
    });
    fastify.delete('/shop/:id', deleteShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await deleteShopController(req, res)
        // удалить заказ
    });
}
