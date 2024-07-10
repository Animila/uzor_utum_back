import {FastifyInstance, RouteShorthandOptions} from "fastify";
import {getUserController} from "../../../application/controllers/userController";
import {registerSchema} from "../schemas/userSchemas";

export function registerAuthRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/register', registerSchema, getUserController);
    // fastify.post<{ Body: {} }>('/auth/login', getUserSchema, getUserController);
    // fastify.post<{ Body: {} }>('/auth/verify', getUserSchema, getUserController);
    // fastify.get<{ Params: { id: string } }>('/users/:id', getUserSchema, getUserController);
}
