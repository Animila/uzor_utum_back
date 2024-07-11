import { FastifyRequest, FastifyReply } from "fastify";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {CreateUser} from "../../useCases/user/userCreate";
import {GetUser} from "../../useCases/user/userGet";
import {UserMap} from "../../mappers/UserMap";
import SMTPMail from "../../infrastructure/smtp/SMTPMail";
import {rabbit} from "../../config/SMTPOptions";

const userRepo = new PrismaUserRepo();

export async function createUserController(request: FastifyRequest<UserRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createUser = new CreateUser(userRepo)
        const newUser =  await createUser.execute({phone: data.phone, email: data.email, last_name: data.last_name, first_name: data.first_name});
        await rabbit.sendEmail({
            code: 12345,
            subject: 'Код для регистрации',
            to: newUser.getEmail().getFull()
        })
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

export async function loginUserController(request: FastifyRequest<UserRequest>, reply: FastifyReply) {
    try {
        const {phone} = request.body;

        const getUser = new GetUser(userRepo)
        const newUser =  await getUser.execute({phone: phone});
        console.log(newUser)
        await rabbit.sendEmail({
            code: 12345,
            subject: 'Код для входа',
            to: newUser.getEmail().getFull()
        })
        reply.status(200).send({
            success: true,
            data: UserMap.toPersistence(newUser)
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