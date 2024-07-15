import {FastifyInstance} from "fastify";
import {registerAuthRoutes} from "./routing/authRouting";
import {registerUserRoutes} from "./routing/userRouting";

export default function registerRoutes(fastify: FastifyInstance) {
    registerAuthRoutes(fastify);
    registerUserRoutes(fastify)
}