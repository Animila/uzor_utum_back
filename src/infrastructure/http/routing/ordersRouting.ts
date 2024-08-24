import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createOrderSchema,
    deleteOrderSchema,
    editOrderSchema,
    getOrderSchema,
    getOrdersSchema
} from "../schemas/orderSchema";
import {
    createOrderController, deleteOrderController, editOrderController,
    getAllOrderController,
    getByIdOrderController
} from "../../../application/controllers/orderController";
import {Roles} from "../../../domain/user/valueObjects/role";


export function registerOrderRouting(fastify: FastifyInstance) {
    fastify.get('/order', getOrdersSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        await getAllOrderController(req, res)
        // получить все заказы
    });
    fastify.get('/order/:id',getOrderSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        await getByIdOrderController(req, res)
        // получить заказ по id
    });
    fastify.put('/order/:id',editOrderSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await editOrderController(req, res)
    });
    fastify.post('/order',createOrderSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        await createOrderController(req, res)
        // создать заказ
    });
    fastify.delete('/order/:id', deleteOrderSchema, async (req: FastifyRequest<OrderRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteOrderController(req, res)
    });
}
