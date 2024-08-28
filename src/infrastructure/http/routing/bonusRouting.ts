import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Roles} from "../../../domain/user/valueObjects/role";
import {
    createBonusSchema,
    deleteBonusSchema,
    getBonusesSchema,
    getByIdBonusSchema, getUserBonusesSchema, getUserSumBonusesSchema,
    updateBonusSchema
} from "../schemas/bonusSchema";
import {
    createBonusController, deleteBonusController,
    getAllBonusController, getBonusesUserController,
    getByIdBonusController, getByUserSumBonusController, updateBonusController
} from "../../../application/controllers/bonusController";

export function registerBonusRouting(fastify: FastifyInstance) {
    fastify.get('/bonuses', getBonusesSchema, async (req: FastifyRequest<BonusRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await getAllBonusController(req, res)
    });

    fastify.get('/bonuses/user/sum/:user_id', getUserSumBonusesSchema, async (req: FastifyRequest<BonusRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // бонусы юзера
        await getByUserSumBonusController(req, res)
    });

    fastify.get('/bonuses/user/:user_id', getUserBonusesSchema, async (req: FastifyRequest<BonusRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        await getBonusesUserController(req, res)
    });

    fastify.get('/bonuses/:id', getByIdBonusSchema, async (req: FastifyRequest<BonusRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await getByIdBonusController(req, res)
    });

    fastify.post('/bonuses', createBonusSchema, async (req: FastifyRequest<BonusRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createBonusController(req, res)
    });

    fastify.put('/bonuses/:id', updateBonusSchema, async (req: FastifyRequest<BonusRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateBonusController(req, res)
    });

    fastify.delete('/bonuses/:id', deleteBonusSchema, async (req: FastifyRequest<BonusRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteBonusController(req, res)
    });

}
