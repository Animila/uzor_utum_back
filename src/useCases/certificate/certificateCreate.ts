import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {Certificate} from "../../domain/certificate/certificate";
import {generateCode} from "../../infrastructure/crypto/generateCode";
import {Email} from "../../domain/user/valueObjects/email";
import {Phone} from "../../domain/user/valueObjects/phone";
import {Role, Roles} from "../../domain/user/valueObjects/role";

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

        const emailOrError = email ? Email.create(email) : undefined
        const phoneOrError = phone ? Phone.create(phone) : undefined

        const errors: Array<{type: string, message: string}> = []


        emailOrError instanceof Error && errors.push({type: 'email', message: emailOrError.message})
        phoneOrError instanceof Error && errors.push({type: 'phone', message: phoneOrError.message})

        if(errors.length > 0 && email && phone)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))


        const data = new Certificate({
            userId: user_id,
            certificateTypeId: certificate_type_id,
            accepted: accepted,
            code: code,
            activated: false,
            deliveryAt: delivery_at,
            email: emailOrError as Email | undefined,
            phone: phoneOrError as Phone | undefined,
        });
        await this.repository.save(data);
        return data;

    }
}