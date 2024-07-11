import {FastifyInstance, RouteShorthandOptions} from "fastify";
import {
    loginController,
    registerController, verifyController
} from "../../../application/controllers/userController";
import {loginSchema, registerSchema, verifySchema} from "../schemas/userSchemas";

export function registerAuthRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/register', registerSchema, registerController);
    fastify.post('/auth/login', loginSchema, loginController);
    fastify.post('/auth/verify', verifySchema, verifyController);
}
