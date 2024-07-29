import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Roles} from "../../../domain/user/valueObjects/role";
import {createOrderSchema, deleteOrderSchema, getOrderSchema, getOrdersSchema} from "../schemas/orderSchema";


export function registerOrderRouting(fastify: FastifyInstance) {
    fastify.get('/order', getOrdersSchema, async (req, res) => {
        // await getAllOrderController(req, res)
        // получить все заказы
    });
    fastify.get('/order/:id',getOrderSchema, async (req: FastifyRequest, res: FastifyReply) => {
        // await getByIdOrderController(req, res)
        // получить заказ по id
    });
    fastify.post('/order',createOrderSchema, async (req: FastifyRequest, res: FastifyReply) => {
        // await createOrderController(req, res)
        // создать заказ
    });
    fastify.delete('/order/:id', deleteOrderSchema, async (req: FastifyRequest, res: FastifyReply) => {
        // await deleteOrderController(req, res)
        // удалить заказ
    });
}
