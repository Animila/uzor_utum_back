import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createSizeSchema,
    deleteSizeSchema,
    getAllSizeSchema,
    getSizeSchema,
    updateSizeSchema
} from "../schemas/sizeSchemas";
import {
    createSizeController,
    deleteSizeController, getAllSizeController,
    getByIdSizeController,
    updateSizeController
} from "../../../application/controllers/sizeController";
import {Roles} from "../../../domain/user/valueObjects/role";


export function registerSizeRouting(fastify: FastifyInstance) {
    fastify.get('/size', getAllSizeSchema, async (req: FastifyRequest<SizeRequest>, res) => {
        await getAllSizeController(req, res)
    });
    fastify.get('/size/:id',getSizeSchema, async (req: FastifyRequest<SizeRequest>, res: FastifyReply) => {
        await getByIdSizeController(req, res)
    });
    fastify.post('/size',createSizeSchema, async (req: FastifyRequest<SizeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createSizeController(req, res)
    });
    fastify.put('/size/:id',updateSizeSchema, async (req: FastifyRequest<SizeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateSizeController(req, res)
    });
    fastify.delete('/size/:id', deleteSizeSchema, async (req: FastifyRequest<SizeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteSizeController(req, res)

    });
}
