import {Roles} from "../../../domain/user/valueObjects/role";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createJournalController, deleteJournalController,
    getAllJournalController,
    getByIdJournalController, updateJournalController
} from "../../../application/controllers/journalController";
import {
    createJournalSchema, deleteJournalSchema,
    getAllJournalSchema,
    getByIdJournalSchema,
    updateJournalSchema
} from "../schemas/journalSchema";

export function registerJournalRouting(fastify: FastifyInstance) {
    fastify.get('/journals', getAllJournalSchema, async (req: FastifyRequest<JournalRequest>, res: FastifyReply) => {
        await getAllJournalController(req, res)
    });
    fastify.get('/journals/:id', getByIdJournalSchema, async (req: FastifyRequest<JournalRequest>, res: FastifyReply) => {
        await getByIdJournalController(req, res)
    });
    fastify.post('/journals', createJournalSchema, async (req: FastifyRequest<JournalRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createJournalController(req, res)
    });
    fastify.put('/journals/:id',updateJournalSchema, async (req: FastifyRequest<JournalRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateJournalController(req, res)
    });
    fastify.delete('/journals/:id', deleteJournalSchema, async (req: FastifyRequest<JournalRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteJournalController(req, res)

    });
}
