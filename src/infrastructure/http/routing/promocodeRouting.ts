import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Roles} from "../../../domain/user/valueObjects/role";
import {
    checkPromoCodeSchema,
    createPromoCodeSchema,
    deletePromoCodeSchema,
    getByIdPromoCodeSchema, getPromoCodesSchema,
    updatePromoCodeSchema
} from "../schemas/promoCodeSchema";
import {
    createPromoCodeController, deletePromoCodeController, getAllPromoCodeController, getByCodePromoCodeController,
    getByIdPromoCodeController, updatePromoCodeController
} from "../../../application/controllers/promocodeController";

export function registerPromoCodeRouting(fastify: FastifyInstance) {
    fastify.get('/promocodes',getPromoCodesSchema, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await getAllPromoCodeController(req, res)
    });

    fastify.post('/promocodes/check', checkPromoCodeSchema, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await getByCodePromoCodeController(req, res)
    });

    fastify.get('/promocodes/:id', getByIdPromoCodeSchema, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await getByIdPromoCodeController(req, res)
    });

    fastify.post('/promocodes', createPromoCodeSchema, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createPromoCodeController(req, res)
    });

    fastify.put('/promocodes/:id', updatePromoCodeSchema, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updatePromoCodeController(req, res)
    });

    fastify.delete('/promocodes/:id', deletePromoCodeSchema, async (req: FastifyRequest<PromoCodeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deletePromoCodeController(req, res)
    });

}
