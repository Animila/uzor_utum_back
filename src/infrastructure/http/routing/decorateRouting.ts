import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createDecorateSchema,
    deleteDecorateSchema,
    getAllDecorateSchema,
    getDecorateSchema,
    updateDecorateSchema
} from "../schemas/decorateSchemas";
import {
} from "../../../application/controllers/probController";
import {Roles} from "../../../domain/user/valueObjects/role";
import {
    createDecorateController, deleteDecorateController,
    getAllDecorateController,
    getByIdDecorateController, updateDecorateController
} from "../../../application/controllers/decorateController";


export function registerDecorateRouting(fastify: FastifyInstance) {
    fastify.get('/decorates', getAllDecorateSchema, async (req, res) => {
        await getAllDecorateController(req, res)
    });
    fastify.get('/decorates/:id',getDecorateSchema, async (req: FastifyRequest<DecorateRequest>, res: FastifyReply) => {
        await getByIdDecorateController(req, res)
    });
    fastify.post('/decorates',createDecorateSchema, async (req: FastifyRequest<DecorateRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createDecorateController(req, res)
    });
    fastify.put('/decorates/:id',updateDecorateSchema, async (req: FastifyRequest<DecorateRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateDecorateController(req, res)
    });
    fastify.delete('/decorates/:id', deleteDecorateSchema, async (req: FastifyRequest<DecorateRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteDecorateController(req, res)

    });
}
