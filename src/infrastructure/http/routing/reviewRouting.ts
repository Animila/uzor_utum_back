import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createReviewController,
    deleteReviewController, editReviewController,
    getAllReviewsController
} from "../../../application/controllers/reviewController";
import {createReviewSchema, getAllReviewSchema} from "../schemas/reviewSchemas";

export function registerReviewRouting(fastify: FastifyInstance) {
    fastify.get('/reviews', getAllReviewSchema, async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
        await getAllReviewsController(req, res)
    });

    // fastify.get('/reviews/:id', async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
    //
    // });

    fastify.post('/reviews',createReviewSchema, async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
        await createReviewController(req, res)
    })

    fastify.put('/reviews/:id',async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        await editReviewController(req, res)
    })
    //
    fastify.delete('/reviews/:id',  async (req: FastifyRequest<ReviewRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        await deleteReviewController(req, res)
    })

}
