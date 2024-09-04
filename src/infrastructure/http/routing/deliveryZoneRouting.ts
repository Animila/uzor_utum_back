import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Roles} from "../../../domain/user/valueObjects/role";
import {
    createDeliveryZoneController, deleteDeliveryZoneController,
    getAllDeliveryZoneController,
    getByIdDeliveryZoneController, updateDeliveryZoneController
} from "../../../application/controllers/deliveryZoneController";
import {
    createDeliveryZoneSchema, deleteDeliveryZoneSchema,
    getAllDeliveryZoneSchema,
    getDeliveryZoneSchema,
    updateDeliveryZoneSchema
} from "../schemas/deliveryZoneSchema";


export function registerDeliveryZoneRouting(fastify: FastifyInstance) {
    fastify.get('/delivery_zone', getAllDeliveryZoneSchema, async (req: FastifyRequest<DeliveryZoneRequest>, res) => {
        await getAllDeliveryZoneController(req, res)
    });
    fastify.get('/delivery_zone/:id',getDeliveryZoneSchema, async (req: FastifyRequest<DeliveryZoneRequest>, res: FastifyReply) => {
        await getByIdDeliveryZoneController(req, res)
    });
    fastify.post('/delivery_zone',createDeliveryZoneSchema, async (req: FastifyRequest<DeliveryZoneRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createDeliveryZoneController(req, res)
    });
    fastify.put('/delivery_zone/:id',updateDeliveryZoneSchema, async (req: FastifyRequest<DeliveryZoneRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateDeliveryZoneController(req, res)
    });
    fastify.delete('/delivery_zone/:id', deleteDeliveryZoneSchema, async (req: FastifyRequest<DeliveryZoneRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        //@ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteDeliveryZoneController(req, res)
    });
}
