import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createReceiverSchema,
    deleteReceiverSchema,
    getAllReceiverSchema,
    getReceiverSchema,
    updateReceiverSchema
} from "../schemas/receiverSchema";
import {
    createReceiverController, deleteReceiverController,
    getAllReceiverController,
    getByIdReceiverController, updateReceiverController
} from "../../../application/controllers/receiverController";


export function registerReceiverRouting(fastify: FastifyInstance) {
    fastify.get('/receiver', getAllReceiverSchema, async (req: FastifyRequest<ReceiverRequest>, res: FastifyReply) => {
        await getAllReceiverController(req, res)
    });
    fastify.get('/receiver/:id',getReceiverSchema, async (req: FastifyRequest<ReceiverRequest>, res: FastifyReply) => {
        await getByIdReceiverController(req, res)
        // получить заказ по id
    });
    fastify.post('/receiver',createReceiverSchema, async (req: FastifyRequest<ReceiverRequest>, res: FastifyReply) => {
        await createReceiverController(req, res)
        // создать заказ
    });
    fastify.put('/receiver/:id',updateReceiverSchema, async (req: FastifyRequest<ReceiverRequest>, res: FastifyReply) => {
        await updateReceiverController(req, res)
        // получить заказ по id
    });
    fastify.delete('/receiver/:id', deleteReceiverSchema, async (req: FastifyRequest<ReceiverRequest>, res: FastifyReply) => {
        await deleteReceiverController(req, res)
        // удалить заказ
    });
}
