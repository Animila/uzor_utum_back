import { FastifyRequest, FastifyReply } from "fastify";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {CreateUser} from "../../useCases/user/userCreate";
import {GetUser} from "../../useCases/user/userGet";
import {UserMap} from "../../mappers/UserMap";
import {rabbit} from "../../config/SMTPOptions";
import {PrismaTokenRepo} from "../../infrastructure/prisma/repo/PrismaTokenRepo";
import CreateToken from "../../useCases/token/tokenCreate";

const userRepo = new PrismaUserRepo();
const tokenRepo = new PrismaTokenRepo();

export async function registerController(request: FastifyRequest<AuthRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createUser = new CreateUser(userRepo)
        const newUser =  await createUser.execute({phone: data.phone, email: data.email, last_name: data.last_name, first_name: data.first_name});
        const createToken = new CreateToken(tokenRepo)
        const newToken = await createToken.execute({userId: newUser.getId()})
        await rabbit.sendEmail({
            code: newToken.getToken().props.value,
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

export async function loginController(request: FastifyRequest<AuthRequest>, reply: FastifyReply) {
    try {
        const {phone} = request.body;

        const getUser = new GetUser(userRepo)
        const newUser =  await getUser.execute({phone: phone});
        console.log(newUser)
        const createToken = new CreateToken(tokenRepo)
        const newToken = await createToken.execute({userId: newUser.getId()})
        await rabbit.sendEmail({
            code: newToken.getToken().props.value,
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

export async function verifyController(request: FastifyRequest<AuthRequest>, reply: FastifyReply) {
    try {
        const {code} = request.body;

        const codeInt = parseInt(code)

        const getUser = new GetUser(userRepo)
        // const newUser =  await getUser.execute({phone: phone});
        // console.log(newUser)
        // const createToken = new CreateToken(tokenRepo)
        // const newToken = await createToken.execute({userId: newUser.getId()})

        reply.status(200).send({
            success: true,
            data: codeInt
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