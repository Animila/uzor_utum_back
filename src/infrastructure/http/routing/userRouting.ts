import {FastifyInstance } from "fastify";

export function registerUserRoutes(fastify: FastifyInstance) {
    fastify.get('/user', () => {});
    fastify.post('/user',  () => {});
    fastify.get('/user/:user_id', () => {});
    fastify.put('/user/:user_id', () => {});
    fastify.delete('/user/:user_id', () => {});
}
