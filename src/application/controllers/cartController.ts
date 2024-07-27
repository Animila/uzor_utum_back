import {PrismaCartRepository} from "../../infrastructure/prisma/repo/PrismaCartRepository";
import {FastifyReply, FastifyRequest} from "fastify";
import {Guard} from "../../domain/guard";
import {CheckCart} from "../../useCases/cart/checkCart";
import {CartMap} from "../../mappers/CartMap";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {GetUserById} from "../../useCases/user/userGetById";

const cartRepo = new PrismaCartRepository()
const userRepo = new PrismaUserRepo()

export async function checkCartController(request: FastifyRequest<CartRequest>, reply: FastifyReply) {
    try {
        const {user_id, token} = request.query as CartRequest['Query']
        const checkResult = Guard.againstNullOrUndefined(token, 'token')
        const checkUser = Guard.againstNullOrUndefined(user_id, 'user_id')


        if(!checkResult.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'token',
                        message: 'Обязательно должен быть'
                    }
                ]
            }))


        if(checkUser.succeeded) {
            var getUser = new GetUserById(userRepo)
            await getUser.execute({user_id: user_id})
        }

        const checkData = new CheckCart(cartRepo)
        const result = await checkData.execute({user_id, token})
        reply.status(201).send({
            success: true,
            data: CartMap.toPersistence(result)
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}