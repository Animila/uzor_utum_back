import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {createReviewController, getAllReviewsController} from "../../../application/controllers/reviewController";
import {createReviewSchema, getAllReviewSchema} from "../schemas/reviewSchemas";

export function registerReviewRouting(fastify: FastifyInstance) {
    fastify.get('/reviews', getAllReviewSchema, async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
        await getAllReviewsController(req, res)
    });

    fastify.get('/reviews/:id', async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {

    });

    fastify.post('/reviews',createReviewSchema, async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
        await createReviewController(req, res)
    })

    fastify.put('/reviews/:id',async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
    })

    fastify.delete('/reviews/:id',  async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
    })

}
