import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {createOrderSchema, deleteOrderSchema, getOrderSchema, getOrdersSchema} from "../schemas/orderSchema";
import {createOrderController} from "../../../application/controllers/orderController";


export function registerOrderRouting(fastify: FastifyInstance) {
    fastify.get('/order', getOrdersSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        // await getAllOrderController(req, res)
        // получить все заказы
    });
    fastify.get('/order/:id',getOrderSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        // await getByIdOrderController(req, res)
        // получить заказ по id
    });
    fastify.post('/order',createOrderSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        await createOrderController(req, res)
        // создать заказ
    });
    fastify.delete('/order/:id', deleteOrderSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        // await deleteOrderController(req, res)
        // удалить заказ
    });
}
