import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createCategorySchema,
    deleteCategorySchema,
    getAllCategorySchema,
    getCategorySchema,
    updateCategorySchema
} from "../schemas/categorySchemas";
import {
    createCategoryController,
    deleteCategoryController,
    getAllCategoryController,
    getByIdCategoryController,
    updateCategoryController
} from "../../../application/controllers/categoryController";
import {Roles} from "../../../domain/user/valueObjects/role";

export function registerCategoryRouting(fastify: FastifyInstance) {
    fastify.get('/category', getAllCategorySchema, async (req, res) => {
        await getAllCategoryController(req, res)
    });
    fastify.get('/category/:id',getCategorySchema, async (req: FastifyRequest<CategoryRequest>, res: FastifyReply) => {
        await getByIdCategoryController(req, res)
    });
    fastify.post('/category/', createCategorySchema, async (req: FastifyRequest<CategoryRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createCategoryController(req, res)
    });
    fastify.put('/category/:id',updateCategorySchema, async (req: FastifyRequest<CategoryRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateCategoryController(req, res)
    });
    fastify.delete('/category/:id', deleteCategorySchema, async (req: FastifyRequest<CategoryRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteCategoryController(req, res)

    });
}
