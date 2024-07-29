import {Roles} from "../../../domain/user/valueObjects/role";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    addViewNewsController,
    createNewsController, deleteNewsController,
    getAllNewsController,
    getByIdNewsController, updateNewsController
} from "../../../application/controllers/newsController";
import {
    createNewsSchema, createViewNewsSchema,
    deleteNewsSchema,
    getAllNewsSchema,
    getByIdNewsSchema,
    updateNewsSchema
} from "../schemas/newsSchema";


export function registerNewsRouting(fastify: FastifyInstance) {
    fastify.get('/news/view/:id', createViewNewsSchema, async (req: FastifyRequest<NewsRequest>, res: FastifyReply) => {
        await addViewNewsController(req, res)
    });
    fastify.get('/news', getAllNewsSchema, async (req: FastifyRequest<NewsRequest>, res: FastifyReply) => {
        await getAllNewsController(req, res)
    });
    fastify.get('/news/:id', getByIdNewsSchema, async (req: FastifyRequest<NewsRequest>, res: FastifyReply) => {
        await getByIdNewsController(req, res)
    });
    fastify.post('/news', createNewsSchema, async (req: FastifyRequest<NewsRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createNewsController(req, res)
    });
    fastify.put('/news/:id',updateNewsSchema, async (req: FastifyRequest<NewsRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateNewsController(req, res)
    });
    fastify.delete('/news/:id', deleteNewsSchema, async (req: FastifyRequest<NewsRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteNewsController(req, res)

    });
}
