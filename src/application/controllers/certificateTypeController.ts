import {PrismaCertificateTypeRepo} from "../../infrastructure/prisma/repo/PrismaCertificateTypeRepo";
import {FastifyReply, FastifyRequest} from "fastify";

import {CertificateTypeMap} from "../../mappers/CertificateTypeMap";
import {GetAllCertificateType} from "../../useCases/certificate/certificateTypeGetAll";
import {GetByIdCertificateType} from "../../useCases/certificate/certificateTypeGetById";
import {CreateCertificateType} from "../../useCases/certificate/certificateTypeCreate";
import {DeleteCertificateType} from "../../useCases/certificate/certificateTypeDelete";
import {UpdateCertificateType} from "../../useCases/certificate/certificateTypeUpdate";

const certRepo = new PrismaCertificateTypeRepo();

export async function getAllCertificateTypeController(request: FastifyRequest<CertificateTypeRequest>, reply: FastifyReply) {
    try {
        const {offset, limit} = request.query as CertificateTypeRequest['Query']
        const getAllCertificateType = new GetAllCertificateType(certRepo)
        const results =  await getAllCertificateType.execute({limit: !!limit ? parseInt(limit) : 10, offset: !!offset ? parseInt(offset) : 0});
        reply.status(200).send({
            success: true,
            data: results.data,
            pagination: {
                totalItems: results.count,
                totalPages: Math.ceil(results.count / (!!limit ? parseInt(limit) : 10)),
                currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                limit: !!limit ? parseInt(limit) : 10
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

export async function getByIdCertificateTypeController(request: FastifyRequest<CertificateTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const getCertificateType = new GetByIdCertificateType(certRepo)
        const data =  await getCertificateType.execute({id: id});

        reply.status(200).send({
            success: true,
            data: CertificateTypeMap.toPersistence(data)
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

export async function createCertificateTypeController(request: FastifyRequest<CertificateTypeRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createService = new CreateCertificateType(certRepo)
        const result =  await createService.execute({
            value: data.value,
            description: data.description,
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

export async function updateCertificateTypeController(request: FastifyRequest<CertificateTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateCertificateType = new UpdateCertificateType(certRepo)
        const material = await updateCertificateType.execute({
            id: id,
            value: data.value,
            description: data.description
        });

        reply.status(200).send({
            success: true,
            data: CertificateTypeMap.toPersistence(material)
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

export async function deleteCertificateTypeController(request: FastifyRequest<CertificateTypeRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delCertificateType = new DeleteCertificateType(certRepo)
        const data = await delCertificateType.execute({id: id})

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
