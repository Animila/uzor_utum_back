import Fastify, {FastifyServerOptions} from "fastify";
import registerRoutes from "./infrastructure/http";
import {swaggerOptions, swaggerUIOptions} from "./config/swaggerOptions";
import {rabbit } from "./config/SMTPOptions";
import multipart from '@fastify/multipart'
import path from "path";
import * as util from "node:util";
import {pipeline} from "node:stream";
const pump = util.promisify(pipeline)

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
    await fastify.register(multipart, {
        attachFieldsToBody: true,
        limits: {
            fileSize: 1024 * 1024 * 1024 * 100,
            files: 1,
            fieldNameSize: 100
        }
    })
    await fastify.register(require("@fastify/swagger"), swaggerOptions)
    await fastify.register(require("@fastify/swagger-ui"), swaggerUIOptions)
    await fastify.register(require('fastify-graceful-shutdown'))
    await fastify.register(require('@fastify/jwt'), {
        secret: process.env.JWT_SECRET || 'NCfpbKgRsaUsRjX6l1KYLuqQs0Pmi6',
        sign: {
            expiresIn: process.env.JWT_SIGN_EXPIRES_IN || '30d',
        },
    })
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '../storage'),
        prefix: '/public/',
    })
    await fastify.register(require('@fastify/cors'), {
        origin: [process.env.LOCALHOST || '', process.env.WEBSITE || ''], // разрешить запросы с localhost:4000
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // разрешить все основные методы
        credentials: true
    })

    fastify.addHook('onClose', async () => {
        await rabbit.closeConnection();
    });

    fastify.get('/', {
        schema: {
            // @ts-ignore
            hide: true,
        }
    }, (_, res) => {
        res.redirect('/documentation')
    })

    registerRoutes(fastify)
    return fastify
}

export { buildApp }
