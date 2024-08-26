import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createLikeController, deleteLikeController,
    getAllLikeController,
    getByIdLikeController, updateLikeController
} from "../../../application/controllers/likeController";
import {
    createLikeSchema,
    deleteLikeSchema,
    getByIdLikeSchema,
    getLikesSchema,
    updateLikeSchema
} from "../schemas/likeSchema";
import {Roles} from "@prisma/client";

export function registerLikeRouting(fastify: FastifyInstance) {
    fastify.get('/likes', getLikesSchema, async (req: FastifyRequest<LikeRequest>, res: FastifyReply) => {
        await getAllLikeController(req, res)
    });
    fastify.get('/likes/:id', getByIdLikeSchema, async (req: FastifyRequest<LikeRequest>, res: FastifyReply) => {
        await getByIdLikeController(req, res)
    });
    fastify.post('/likes', createLikeSchema, async (req: FastifyRequest<LikeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        await createLikeController(req, res)
    });
    fastify.put('/likes/:id',updateLikeSchema, async (req: FastifyRequest<LikeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        await updateLikeController(req, res)
    });
    fastify.delete('/likes/:id', deleteLikeSchema, async (req: FastifyRequest<LikeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        await deleteLikeController(req, res)

    });
}
