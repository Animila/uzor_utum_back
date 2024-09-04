import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {GetUserAll} from "../../useCases/user/userGetAll";
import {GetUserById} from "../../useCases/user/userGetById";
import {UserMap} from "../../mappers/UserMap";
import {UpdateUser} from "../../useCases/user/userUpdate";
import {DeleteUserById} from "../../useCases/user/userDeleteById";
import {PrismaBonusRepository} from "../../infrastructure/prisma/repo/PrismaBonusRepository";
import {GetBySumUserBonus} from "../../useCases/bonus/bonusGetSumUser";
import {Roles} from "../../domain/user/valueObjects/role";
import {GetAllReview} from "../../useCases/review/reviewGetAll";
import {PrismaReviewRepo} from "../../infrastructure/prisma/repo/PrismaReviewRepo";

const userRepo = new PrismaUserRepo();
const bonusRepo = new PrismaBonusRepository();
const reviewRepo = new PrismaReviewRepo()

export async function getAllController(request: FastifyRequest<UserRequest>, reply: FastifyReply) {
    try {
        const data = request.query as UserRequest['Query']
        const getAllUser = new GetUserAll(userRepo)
        const users =  await getAllUser.execute(data.limit ? parseInt(data.limit) : undefined, data.offset ? parseInt(data.offset): undefined, data.q);
        const getBonus = new GetBySumUserBonus(bonusRepo)

        for (const user of users.data) {
            user.bonus = await getBonus.execute({user_id: user.id});
        }

        reply.status(200).send({
            success: true,
            data: users.data,
            pagination: {
                totalItems: users.count,
                totalPages: Math.ceil(users.count / (data.limit ? parseInt(data.limit) : 10)),
                currentPage: (data.offset ? parseInt(data.offset) : 0) + 1,
                limit: (data.limit ? parseInt(data.limit) : 10)
            }
        });
    } catch (error: any) {
        console.log('userControllerGetAll', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function getByIdController(request: FastifyRequest<UserRequest>, reply: FastifyReply) {
    try {
        const {user_id} = request.params
        await request.jwtVerify()
        // @ts-ignore
        if(request.user.data.role !== Roles.admin && request.user.data.user_id !== user_id) return reply.status(403).send('Not authorized')
        const getUser = new GetUserById(userRepo)
        const getReview = new GetAllReview(reviewRepo)

        const user =  await getUser.execute({user_id: user_id});
        const userPer = UserMap.toPersistence(user)


        const getBonus = new GetBySumUserBonus(bonusRepo)
        userPer.bonus = await getBonus.execute({user_id: user_id});


        reply.status(200).send({
            success: true,
            data: userPer
        });
    } catch (error: any) {
        console.log('userControllerGetId', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function updateController(request: FastifyRequest<UserRequest>, reply: FastifyReply) {
    try {
        const {user_id} = request.params
        const data = request.body || {};
        await request.jwtVerify()
        if(data.role) {
            // @ts-ignore
            if(request.user.data.role != Roles.admin) return reply.status(403).send('Not authorized')
        }
        //@ts-ignore
        if(request.user.data.role !== Roles.admin && request.user.data.user_id !== user_id) return reply.status(403).send('Not authorized')


        const updateUser = new UpdateUser(userRepo)
        const user = await updateUser.execute({
            id: user_id,
            phone: data.phone,
            email: data.email,
            last_name: data.last_name,
            first_name: data.first_name,
            role: data.role
        });

        const userPer = UserMap.toPersistence(user)

        const getBonus = new GetBySumUserBonus(bonusRepo)
        userPer.bonus = await getBonus.execute({user_id: user_id});

        reply.status(200).send({
            success: true,
            data: userPer
        });
    } catch (error: any) {
        console.log('userControllerUpdate', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function deleteController(request: FastifyRequest<UserRequest>, reply: FastifyReply) {
    try {
        const {user_id} = request.params
        await request.jwtVerify()
        //@ts-ignore
        if(request.user.data.role !== Roles.admin && request.user.data.user_id !== user_id) return reply.status(403).send('Not authorized')
        const delUser = new DeleteUserById(userRepo)
        const data = await delUser.execute({user_id: user_id})
        reply.status(200).send({
            success: true,
            data: {
                success: data
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
