import {PrismaCertificateRepo} from "../../infrastructure/prisma/repo/PrismaCertificateRepo";
import {FastifyReply, FastifyRequest} from "fastify";

import {CertificateMap} from "../../mappers/CertificateMap";
import {GetAllCertificate} from "../../useCases/certificate/certificateGetAll";
import {GetByIdCertificate} from "../../useCases/certificate/certificateGetById";
import {CreateCertificate} from "../../useCases/certificate/certificateCreate";
import {DeleteCertificate} from "../../useCases/certificate/certificateDelete";
import {GetByIdCertificateType} from "../../useCases/certificate/certificateTypeGetById";
import {PrismaCertificateTypeRepo} from "../../infrastructure/prisma/repo/PrismaCertificateTypeRepo";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {GetUserById} from "../../useCases/user/userGetById";
import {initialPayment} from "../../infrastructure/youkassa/initialPayment";
import {GetByCodeCertificate} from "../../useCases/certificate/certificateGetByCode";
import {Guard} from "../../domain/guard";
import {CertificateTypeMap} from "../../mappers/CertificateTypeMap";
import {scheduleSendEmail} from "../../infrastructure/nodecron/scheduleNotification";
import {redis} from "../../infrastructure/redis/redis";

const certRepo = new PrismaCertificateRepo();
const certTypeRepo = new PrismaCertificateTypeRepo();
const userRepo = new PrismaUserRepo()

export async function getAllCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
    try {
        const {certificate_type_id, limit, offset, q} = request.query as CertificateRequest['Query']
        const getAllCertificate = new GetAllCertificate(certRepo)
        const results =  await getAllCertificate.execute({limit: !!limit ? parseInt(limit) : 10, offset: !!offset ? parseInt(offset) : 0, certificate_type_id, search: q});
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
        console.log('certificateControllerGetAll: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function getByCodeCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
    try {
        const {code} = request.query as CertificateRequest['Query']
        const check = Guard.againstNullOrUndefined(code, 'code')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'code',
                        message: 'Нет code'
                    }
                ]
            }))
        const getCertificate = new GetByCodeCertificate(certRepo)
        const getTypeCert = new GetByIdCertificateType(certTypeRepo)
        const result =  await getCertificate.execute({code: code!});
        const dataPer = CertificateMap.toPersistence(result)
        dataPer.certificate_type = CertificateTypeMap.toPersistence(await getTypeCert.execute({id: result.getCertificateTypeId()}))
        reply.status(200).send({
            success: true,
            data: dataPer
        });
    } catch (error: any) {
        console.log('certificateControllerGetCode: ', error.message)
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
        console.log('certificateControllerGetId: ', error.message)
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
        const certType = await getCertificateType.execute({id: data.certificate_type_id})

        let user
        const getUser = new GetUserById(userRepo)
        user = data.user_id ? await getUser.execute({user_id: data.user_id}) : undefined

        const createService = new CreateCertificate(certRepo)
        const result =  await createService.execute({
            user_id: data.user_id,
            certificate_type_id: data.certificate_type_id,
            accepted: data.accepted,
            phone: user ? user.getPhone().getFullPhone() : data.phone,
            email: user ? user.getEmail().getFull() : data.email,
            delivery_at: data.delivery_at
        });

        const resultPay = await initialPayment(
            "certificate",
            result.getId(),
            `Покупка сертификата на: ${certType.getValue()} рублей`,
            result.getId(),
            certType.getValue().toString())


        if(!resultPay.success) {
            await certRepo.delete(result.getId())
            reply.status(500).send({
                success: false,
                message: resultPay.message
            })
        }

        result.props.orderId = resultPay.data?.payment_id

        await certRepo.save(result)

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                url_confirm: resultPay.data?.payment_url
            }
        });
    } catch (error: any) {
        console.log('certificateControllerCreate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}


export async function deleteCertificateController(request: FastifyRequest<CertificateRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delCertificate = new DeleteCertificate(certRepo)
        const data = await delCertificate.execute({id: id})

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('certificateControllerDelete: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
