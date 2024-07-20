import {FastifyInstance} from "fastify";
import {registerAuthRoutes} from "./routing/authRouting";
import {registerUserRoutes} from "./routing/userRouting";
import {registerCategoryRouting} from "./routing/categoryRouting";
import {registerMaterialRouting} from "./routing/materialRouting";
import {registerProductRouting} from "./routing/productRouting";
import {registerDiscountRouting} from "./routing/discountRouting";

export default function registerRoutes(fastify: FastifyInstance) {
    registerAuthRoutes(fastify);
    registerUserRoutes(fastify)
    registerCategoryRouting(fastify)
    registerMaterialRouting(fastify)
    registerProductRouting(fastify)
    registerDiscountRouting(fastify)
}