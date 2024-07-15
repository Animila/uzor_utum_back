import Fastify, {FastifyServerOptions} from "fastify";
import registerRoutes from "./infrastructure/http";
import {swaggerOptions, swaggerUIOptions} from "./config/swaggerOptions";
import {rabbit } from "./config/SMTPOptions";
export type AppOptions = Partial<FastifyServerOptions>

declare module 'fastify' {
    interface FastifyInstance {
        // @ts-ignore
        jwt: import('@fastify/jwt').FastifyJWT;
    }
}

async function buildApp(options: AppOptions = {}) {
    await rabbit.connectQueue()
    const fastify = Fastify(options)
    await fastify.register(require("@fastify/swagger"), swaggerOptions)
    await fastify.register(require("@fastify/swagger-ui"), swaggerUIOptions)
    await fastify.register(require('fastify-graceful-shutdown'))
    await fastify.register(require('@fastify/jwt'), {
        secret: process.env.JWT_SECRET || 'NCfpbKgRsaUsRjX6l1KYLuqQs0Pmi6',
    })

    fastify.addHook('onClose', async () => {
        await rabbit.closeConnection();
    });

    registerRoutes(fastify)
    return fastify
}

export { buildApp }