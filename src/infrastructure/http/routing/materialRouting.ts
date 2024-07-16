import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createMaterialSchema,
    deleteMaterialSchema,
    getAllMaterialSchema,
    getMaterialSchema,
    updateMaterialSchema
} from "../schemas/materialSchemas";
import {
    createMaterialController,
    deleteMaterialController, getAllMaterialController,
    getByIdMaterialController,
    updateMaterialController
} from "../../../application/controllers/materialController";
import {Roles} from "../../../domain/user/valueObjects/role";


export function registerMaterialRouting(fastify: FastifyInstance) {
    fastify.get('/material', getAllMaterialSchema, async (req, res) => {
        await getAllMaterialController(req, res)
    });
    fastify.get('/material/:id',getMaterialSchema, async (req: FastifyRequest<MaterialRequest>, res: FastifyReply) => {
        await getByIdMaterialController(req, res)
    });
    fastify.post('/material',createMaterialSchema, async (req: FastifyRequest<MaterialRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createMaterialController(req, res)
    });
    fastify.put('/material/:id',updateMaterialSchema, async (req: FastifyRequest<MaterialRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateMaterialController(req, res)
    });
    fastify.delete('/material/:id', deleteMaterialSchema, async (req: FastifyRequest<MaterialRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteMaterialController(req, res)

    });
}
