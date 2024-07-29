import {PrismaCertificateRepo} from "../../infrastructure/prisma/repo/PrismaCertificateRepo";
import {FastifyReply, FastifyRequest} from "fastify";

import {CertificateMap} from "../../mappers/CertificateMap";
import {GetAllCertificate} from "../../useCases/certificate/certificateGetAll";
import {GetByIdCertificate} from "../../useCases/certificate/certificateGetById";
import {CreateCertificate} from "../../useCases/certificate/certificateCreate";
import {DeleteCertificate} from "../../useCases/certificate/certificateDelete";
import {GetByIdCertificateType} from "../../useCases/certificate/certificateTypeGetById";
import {PrismaCertificateTypeRepo} from "../../infrastructure/prisma/repo/PrismaCertificateTypeRepo";

const certRepo = new PrismaCertificateRepo();
const certTypeRepo = new PrismaCertificateTypeRepo();

export async function getAllCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
    try {
        const {certificate_type_id} = request.query as CertificateRequest['Query']
        const getAllCertificate = new GetAllCertificate(certRepo)
        const results =  await getAllCertificate.execute({certificate_type_id});
        reply.status(200).send({
            success: true,
            data: results
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

export async function getByIdCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getCertificate = new GetByIdCertificate(certRepo)
        const data =  await getCertificate.execute({id: id});

        reply.status(200).send({
            success: true,
            data: CertificateMap.toPersistence(data)
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

export async function createCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const getCertificateType = new GetByIdCertificateType(certTypeRepo)
        await getCertificateType.execute({id: data.certificate_type_id})

        const createService = new CreateCertificate(certRepo)
        const result =  await createService.execute({
            user_id: data.user_id,
            certificate_type_id: data.certificate_type_id,
            accepted: data.accepted,
            phone: data.phone,
            email: data.email,
            delivery_at: data.delivery_at
        });

        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
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

// export async function updateCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
//     try {
//         const {id} = request.params
//         const data = request.body || {};
//         const updateCertificate = new UpdateCertificate(certRepo)
//         const material = await updateCertificate.execute({
//             id: id,
//             title: data.title
//         });
//
//         reply.status(200).send({
//             success: true,
//             data: CertificateMap.toPersistence(material)
//         });
//     } catch (error: any) {
//         console.log('345678', error.message)
//         const errors = JSON.parse(error.message)
//         reply.status(errors.status).send({
//             success: false,
//             message: errors.message
//         })
//     }
// }

export async function deleteCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delCertificate = new DeleteCertificate(certRepo)
        const data = await delCertificate.execute({id: id})

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