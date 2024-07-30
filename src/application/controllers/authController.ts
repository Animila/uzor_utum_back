import {FastifyRequest, FastifyReply, FastifyInstance} from "fastify";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {CreateUser} from "../../useCases/user/userCreate";
import {GetUserByPhone} from "../../useCases/user/userGetByPhone";
import {UserMap} from "../../mappers/UserMap";
import {rabbit} from "../../config/SMTPOptions";
import {PrismaTokenRepo} from "../../infrastructure/prisma/repo/PrismaTokenRepo";
import CreateToken from "../../useCases/token/tokenCreate";
import UpdateToken from "../../useCases/token/tokenUpdate";
import {GetUserById} from "../../useCases/user/userGetById";

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

        const getUser = new GetUserByPhone(userRepo)
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

export async function verifyController(request: FastifyRequest<AuthRequest>, reply: FastifyReply, fastify: FastifyInstance) {
    try {
        const {code} = request.body;
        console.log(code)

        const updateToken = new UpdateToken(tokenRepo)
        const getUser = new GetUserById(userRepo)
        const user_id =  await updateToken.execute({token: code});
        console.log(user_id)
        const user = await getUser.execute({user_id: user_id})
        console.log(user)

        const token = fastify.jwt.sign({
            data: {
                user_id: user_id,
                role: user.getRole().getValue()
            }
        })
        reply.status(200).send({
            success: true,
            data: {
                token: token
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