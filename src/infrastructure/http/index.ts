import {FastifyInstance} from "fastify";
import {registerAuthRoutes} from "./routing/authRouting";
import {registerUserRoutes} from "./routing/userRouting";
import {registerCategoryRouting} from "./routing/categoryRouting";
import {registerMaterialRouting} from "./routing/materialRouting";
import {registerSizeRouting} from "./routing/sizeRouting";
import {registerDecorTypeRouting} from "./routing/decorTypeRouting";

export default function registerRoutes(fastify: FastifyInstance) {
    registerAuthRoutes(fastify);
    registerUserRoutes(fastify)
    registerCategoryRouting(fastify)
    registerMaterialRouting(fastify)
    registerSizeRouting(fastify)
    registerDecorTypeRouting(fastify)
}