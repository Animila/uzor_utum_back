import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {deleteUserSchema, getAllSchema, getUserSchema, updateUserSchema} from "../schemas/userSchemas";
import {
    deleteController,
    getAllController,
    getByIdController,
    updateController
} from "../../../application/controllers/userController";
import {Roles} from "../../../domain/user/valueObjects/role";

export function registerUserRoutes(fastify: FastifyInstance) {
    fastify.get('/user', getAllSchema, async (req: FastifyRequest<UserRequest>, res) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await getAllController(req, res)
    });
    // fastify.post('/user',  () => {});
    fastify.get('/user/:user_id',getUserSchema, async (req: FastifyRequest<UserRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        await getByIdController(req, res)
    });
    fastify.put('/user/:user_id',updateUserSchema, async (req: FastifyRequest<UserRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        await updateController(req, res)
    });
    fastify.delete('/user/:user_id', deleteUserSchema, async (req: FastifyRequest<UserRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteController(req, res)

    });
}
