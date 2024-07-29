import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createCertificateTypeController,
    deleteCertificateTypeController, getAllCertificateTypeController,
    getByIdCertificateTypeController, updateCertificateTypeController
} from "../../../application/controllers/certificateTypeController";
import {Roles} from "../../../domain/user/valueObjects/role";
import {
    createCertificateTypeSchema,
    deleteCertificateTypeSchema,
    getAllCertificateTypeSchema,
    getByIdCertificateTypeSchema, updateCertificateTypeSchema
} from "../schemas/certificateTypeSchema";


export function registerCertificateTypeRouting(fastify: FastifyInstance) {
    fastify.get('/certificate_type', getAllCertificateTypeSchema, async (req: FastifyRequest<CertificateTypeRequest>, res: FastifyReply) => {
        await getAllCertificateTypeController(req, res)
    });
    fastify.get('/certificate_type/:id',getByIdCertificateTypeSchema, async (req: FastifyRequest<CertificateTypeRequest>, res: FastifyReply) => {
        await getByIdCertificateTypeController(req, res)
    });
    fastify.post('/certificate_type',createCertificateTypeSchema, async (req: FastifyRequest<CertificateTypeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await createCertificateTypeController(req, res)
    });
    fastify.put('/certificate_type/:id', updateCertificateTypeSchema, async (req: FastifyRequest<CertificateTypeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await updateCertificateTypeController(req, res)
    });
    fastify.delete('/certificate_type/:id', deleteCertificateTypeSchema, async (req: FastifyRequest<CertificateTypeRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteCertificateTypeController(req, res)
    });
}
