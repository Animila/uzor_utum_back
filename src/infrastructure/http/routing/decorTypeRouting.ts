import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createDecorTypeController,
    deleteDecorTypeController,
    getAllDecorTypeController, getByIdDecorTypeController, updateDecorTypeController
} from "../../../application/controllers/decorTypeController";
import {
    createDecorationTypeSchema,
    deleteDecorationTypeSchema,
    getAllDecorationTypeSchema,
    getDecorationTypeSchema,
    updateDecorationTypeSchema
} from "../schemas/decorTypeSchemas";
import {Roles} from "../../../domain/user/valueObjects/role";


export function registerDecorTypeRouting(fastify: FastifyInstance) {
    fastify.get('/decor_type', getAllDecorationTypeSchema, async (req, res) => {
        await getAllDecorTypeController(req, res)
    });
    fastify.get('/decor_type/:id',getDecorationTypeSchema, async (req: FastifyRequest<DecorationTypeRequest>, res: FastifyReply) => {
        await getByIdDecorTypeController(req, res)
    });
    fastify.post('/decor_type',createDecorationTypeSchema, async (req: FastifyRequest<DecorationTypeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createDecorTypeController(req, res)
    });
    fastify.put('/decor_type/:id',updateDecorationTypeSchema, async (req: FastifyRequest<DecorationTypeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateDecorTypeController(req, res)
    });
    fastify.delete('/decor_type/:id', deleteDecorationTypeSchema, async (req: FastifyRequest<DecorationTypeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteDecorTypeController(req, res)

    });
}
