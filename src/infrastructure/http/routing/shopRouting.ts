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
    getByIdShopController, updateShopController
} from "../../../application/controllers/shopController";
import {Roles} from "../../../domain/user/valueObjects/role";


export function registerShopRouting(fastify: FastifyInstance) {
    fastify.get('/shop', getAllShopSchema, async (req: FastifyRequest<ShopRequest>, res) => {
        await getAllShopController(req, res)
    });
    fastify.get('/shop/:id',getShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await getByIdShopController(req, res)
    });
    fastify.post('/shop',createShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createShopController(req, res)
    });
    fastify.put('/shop/:id',updateShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateShopController(req, res)
    });
    fastify.delete('/shop/:id', deleteShopSchema, async (req: FastifyRequest<ShopRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteShopController(req, res)
    });
}
