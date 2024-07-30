import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createSendTypeSchema,
    deleteSendTypeSchema,
    getAllSendTypeSchema,
    getSendTypeSchema,
    updateSendTypeSchema
} from "../schemas/sendTypeSchema";
import {
    createSendTypeController, deleteSendTypeController,
    getAllSendTypeController,
    getByIdSendTypeController, updateSendTypeController
} from "../../../application/controllers/sendTypeController";


export function registerSendTypeRouting(fastify: FastifyInstance) {
    fastify.get('/send_type', getAllSendTypeSchema, async (req: FastifyRequest<SendTypeRequest>, res: FastifyReply) => {
        await getAllSendTypeController(req, res)
    });
    fastify.get('/send_type/:id',getSendTypeSchema, async (req: FastifyRequest<SendTypeRequest>, res: FastifyReply) => {
        await getByIdSendTypeController(req, res)
        // получить заказ по id
    });
    fastify.post('/send_type',createSendTypeSchema, async (req: FastifyRequest<SendTypeRequest>, res: FastifyReply) => {
        await createSendTypeController(req, res)
        // создать заказ
    });
    fastify.put('/send_type/:id',updateSendTypeSchema, async (req: FastifyRequest<SendTypeRequest>, res: FastifyReply) => {
        await updateSendTypeController(req, res)
        // получить заказ по id
    });
    fastify.delete('/send_type/:id', deleteSendTypeSchema, async (req: FastifyRequest<SendTypeRequest>, res: FastifyReply) => {
        await deleteSendTypeController(req, res)
        // удалить заказ
    });
}
