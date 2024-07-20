import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createDiscountController, deleteDiscountController,
    getByIdDiscountController, getByProductIdDiscountController,
    updateDiscountController
} from "../../../application/controllers/discountController";
import {
    createDiscountSchema,
    deleteDiscountSchema,
    getByIdDiscountSchema, getByIdProductDiscountSchema,
    updateDiscountSchema
} from "../schemas/discountSchema";
import {Roles} from "../../../domain/user/valueObjects/role";
import {getByIdProductController} from "../../../application/controllers/productController";

export function registerDiscountRouting(fastify: FastifyInstance) {
    fastify.get('/discounts/product/:product_id', getByIdProductDiscountSchema, async (req: FastifyRequest<DiscountRequest>, res: FastifyReply) => {
        await getByProductIdDiscountController(req, res)
    });
    fastify.get('/discounts/:id', getByIdDiscountSchema, async (req: FastifyRequest<DiscountRequest>, res: FastifyReply) => {
        await getByIdDiscountController(req, res)
    });
    fastify.post('/discounts', createDiscountSchema, async (req: FastifyRequest<DiscountRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createDiscountController(req, res)
    });
    fastify.put('/discounts/:id',updateDiscountSchema, async (req: FastifyRequest<DiscountRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateDiscountController(req, res)
    });
    fastify.delete('/discounts/:id', deleteDiscountSchema, async (req: FastifyRequest<DiscountRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteDiscountController(req, res)

    });
}
