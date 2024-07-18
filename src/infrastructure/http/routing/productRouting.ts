import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createProductController, deleteProductController,
    getAllProductController,
    getByIdProductController, updateProductController
} from "../../../application/controllers/productController";
import {
    createProductSchema, deleteProductSchema,
    getAllProductSchema,
    getByIdProductSchema,
    updateProductSchema
} from "../schemas/productSchema";
import {Roles} from "../../../domain/user/valueObjects/role";

export function registerProductRouting(fastify: FastifyInstance) {
    fastify.get('/products', getAllProductSchema, async (req: FastifyRequest<ProductRequest>, res: FastifyReply) => {
        await getAllProductController(req, res)
    });
    fastify.get('/products/:id', getByIdProductSchema, async (req: FastifyRequest<ProductRequest>, res: FastifyReply) => {
        await getByIdProductController(req, res)
    });
    fastify.post('/products', createProductSchema, async (req: FastifyRequest<ProductRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createProductController(req, res)
    });
    fastify.put('/products/:id',updateProductSchema, async (req: FastifyRequest<ProductRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateProductController(req, res)
    });
    fastify.delete('/products/:id', deleteProductSchema, async (req: FastifyRequest<ProductRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteProductController(req, res)

    });
}
