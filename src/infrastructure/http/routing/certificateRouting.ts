import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {
    createCertificateController,
    deleteCertificateController, getAllCertificateController, getByCodeCertificateController,
    getByIdCertificateController
} from "../../../application/controllers/certificateController";
import {Roles} from "../../../domain/user/valueObjects/role";
import {
    checkCertificateSchema,
    createCertificateSchema,
    deleteCertificateSchema,
    getAllCertificateSchema,
    getByIdCertificateSchema
} from "../schemas/certificateSchema";


export function registerCertificateRouting(fastify: FastifyInstance) {
    fastify.get('/certificate', getAllCertificateSchema, async (req: FastifyRequest<CertificateRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await getAllCertificateController(req, res)
    });
    fastify.get('/certificate/check', checkCertificateSchema, async (req: FastifyRequest<CertificateRequest>, res: FastifyReply) => {
        await getByCodeCertificateController(req, res)
    });
    fastify.get('/certificate/:id',getByIdCertificateSchema, async (req: FastifyRequest<CertificateRequest>, res: FastifyReply) => {
        await getByIdCertificateController(req, res)
    });
    fastify.post('/certificate',createCertificateSchema, async (req: FastifyRequest<CertificateRequest>, res: FastifyReply) => {
        await createCertificateController(req, res)
    });
    fastify.delete('/certificate/:id', deleteCertificateSchema, async (req: FastifyRequest<CertificateRequest>, res: FastifyReply) => {
        await req.jwtVerify()
        // @ts-ignore
        if(req.user.data.role != Roles.admin) return res.status(403).send('Not authorized')
        await deleteCertificateController(req, res)
    });
}
