import {FastifyInstance} from "fastify";
import {registerAuthRoutes} from "./routing/authRouting";

export default function registerRoutes(fastify: FastifyInstance) {
    registerAuthRoutes(fastify);
}