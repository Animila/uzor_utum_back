import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {Certificate} from "../../domain/certificate/certificate";
import {generateCode} from "../../infrastructure/crypto/generateCode";

interface CreateCertificateInput {
    certificate_type_id: string,
    phone?: string,
    email?: string,
    user_id?: string,
    delivery_at: Date,
    accepted: boolean
}

export class CreateCertificate {
    private repository: ICertificateRepository;

    constructor(repository: ICertificateRepository) {
        this.repository = repository;
    }

    async execute(input: CreateCertificateInput): Promise<Certificate> {
        const {
            user_id,
            certificate_type_id,
            accepted,
            delivery_at,
            email,
            phone

        } = input;

        const code = generateCode(10).toString()


        const data = new Certificate({
            userId: user_id,
            certificateTypeId: certificate_type_id,
            accepted: accepted,
            code: code,
            activated: false,
            deliveryAt: delivery_at,
            email: email,
            phone: phone,
        });
        await this.repository.save(data);
        return data;

    }
}