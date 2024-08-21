import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createProbSchema,
    deleteProbSchema,
    getAllProbSchema,
    getProbSchema,
    updateProbSchema
} from "../schemas/probSchemas";
import {
    createProbController,
    deleteProbController, getAllProbController,
    getByIdProbController,
    updateProbController
} from "../../../application/controllers/probController";
import {Roles} from "../../../domain/user/valueObjects/role";


export function registerProbRouting(fastify: FastifyInstance) {
    fastify.get('/probs', getAllProbSchema, async (req: FastifyRequest<ProbRequest>, res) => {
        await getAllProbController(req, res)
    });
    fastify.get('/probs/:id',getProbSchema, async (req: FastifyRequest<ProbRequest>, res: FastifyReply) => {
        await getByIdProbController(req, res)
    });
    fastify.post('/probs',createProbSchema, async (req: FastifyRequest<ProbRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createProbController(req, res)
    });
    fastify.put('/probs/:id',updateProbSchema, async (req: FastifyRequest<ProbRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateProbController(req, res)
    });
    fastify.delete('/probs/:id', deleteProbSchema, async (req: FastifyRequest<ProbRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteProbController(req, res)

    });
}
