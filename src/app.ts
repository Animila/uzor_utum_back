import Fastify, {FastifyServerOptions} from "fastify";
import registerRoutes from "./infrastructure/http";
import {swaggerOptions, swaggerUIOptions} from "./config/swaggerOptions";
import {rabbit } from "./config/SMTPOptions";

export type AppOptions = Partial<FastifyServerOptions>



async function buildApp(options: AppOptions = {}) {
    await rabbit.connectQueue()
    const fastify = Fastify(options)
    await fastify.register(require("@fastify/swagger"), swaggerOptions)
    await fastify.register(require("@fastify/swagger-ui"), swaggerUIOptions)
    fastify.register(require('fastify-graceful-shutdown'))

    fastify.addHook('onClose', async () => {
        await rabbit.closeConnection();
    });

    registerRoutes(fastify)
    return fastify
}

export { buildApp }