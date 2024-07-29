import {PrismaCertificateRepo} from "../../infrastructure/prisma/repo/PrismaCertificateRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {GetAllCertificate} from "../../useCases/certificate/certificateGetAll";

const certRepo = new PrismaCertificateRepo();

export async function getPaymentStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
        console.log(request)
        console.log(request.body)
        console.log(request.query)
        console.log(request.params)
        // const getAllCertificate = new GetAllCertificate(certRepo)
        // const results =  await getAllCertificate.execute({certificate_type_id});
        // reply.status(200).send({
        //     success: true,
        //     data: results
        // });
    } catch (error: any) {
        console.log('345678', error.message)
        // const errors = JSON.parse(error.message)
        // reply.status(errors.status).send({
        //     success: false,
        //     message: errors.message
        // })
    }
}