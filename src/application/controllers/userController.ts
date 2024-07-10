import { FastifyRequest, FastifyReply } from "fastify";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {CreateUser} from "../../useCases/user/userCreate";

const userRepo = new PrismaUserRepo();

export async function getUserController(request: FastifyRequest<UserRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createUser = new CreateUser(userRepo)
        const newUser =  await createUser.execute({phone: data.phone, email: data.email, last_name: data.last_name, first_name: data.first_name});
        reply.status(200).send({
            success: true,
            data: {
                id: newUser.getId(),
            }
        });
    } catch (error: any) {
        console.log('345678', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}