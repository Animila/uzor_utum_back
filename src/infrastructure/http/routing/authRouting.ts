import {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {
    loginController,
    registerController, verifyController
} from "../../../application/controllers/authController";
import {checkAuth, loginSchema, registerSchema, verifySchema} from "../schemas/authSchemas";
import {success} from "concurrently/dist/src/defaults";
import {PrismaUserRepo} from "../../prisma/repo/PrismaUserRepo";

export function registerAuthRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/register', registerSchema, registerController);
    fastify.post('/auth/login', loginSchema, loginController);
    fastify.post('/auth/verify', verifySchema, async (request: FastifyRequest<AuthRequest>, reply: FastifyReply) => {
        await verifyController(request, reply, fastify)
    });
    fastify.get('/auth/check', checkAuth,async (request: FastifyRequest<AuthRequest>, reply: FastifyReply) => {
        await request.jwtVerify()
        const data = request.user

        const userRepo = new PrismaUserRepo()

        //@ts-ignore
        const userFind = await userRepo.findById(data.data.user_id)

        if(!userFind) return reply.status(403).send('Not authorized')

        userFind.props.lastOnlineAt = new Date()

        await userRepo.save(userFind)

        reply.send({
            success: true,
            // @ts-ignore
            data: data.data
        })
    });
}
