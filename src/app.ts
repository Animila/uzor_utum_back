import Fastify, {FastifyServerOptions} from "fastify";
import registerRoutes from "./infrastructure/http";

export type AppOptions = Partial<FastifyServerOptions>

async function buildApp(options: AppOptions = {}) {
    const fastify = Fastify(options)
    await fastify.register(require("@fastify/swagger"), {
        mode: 'dynamic',
        swagger: {
            info: {
                title: 'Uzor Utum API',
                description: 'API документация',
                version: '0.1.0'
            },
            host: 'localhost:3000',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json']
        }
    })
    await fastify.register(require("@fastify/swagger-ui"), {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },

    })

    registerRoutes(fastify)


    return fastify
}

export { buildApp }