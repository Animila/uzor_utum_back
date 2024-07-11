import {FastifyInstance, RouteShorthandOptions} from "fastify";
import {createUserController, loginUserController} from "../../../application/controllers/userController";
import {loginSchema, registerSchema} from "../schemas/userSchemas";

export function registerAuthRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/register', registerSchema, createUserController);
    fastify.post('/auth/login', loginSchema, loginUserController);
}
