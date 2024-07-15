import {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {
    loginController,
    registerController, verifyController
} from "../../../application/controllers/userController";
import {checkAuth, loginSchema, registerSchema, verifySchema} from "../schemas/userSchemas";

export function registerAuthRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/register', registerSchema, registerController);
    fastify.post('/auth/login', loginSchema, loginController);
    fastify.post('/auth/verify', verifySchema, async (request: FastifyRequest<AuthRequest>, reply: FastifyReply) => {
        await verifyController(request, reply, fastify)
    });
    fastify.get('/auth/check', checkAuth,async (request: FastifyRequest<AuthRequest>, reply: FastifyReply) => {
        await request.jwtVerify()
        const data = request.user
        reply.send({
            success: true,
            data: {
                // @ts-ignore
                user_id: data.data
            }
        })
    });
}
