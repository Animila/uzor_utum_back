import {ICertificateTypeRepository} from "../../repositories/ICertificateTypeRepository";
import {CertificateType} from "../../domain/certificate/certificateType";

interface CreateCertificateTypeInput {
    value: number
    description: string
}

export class CreateCertificateType {
    private repository: ICertificateTypeRepository;

    constructor(repository: ICertificateTypeRepository) {
        this.repository = repository;
    }

    async execute(input: CreateCertificateTypeInput): Promise<CertificateType> {
        const { value, description } = input;

        const data = new CertificateType({
            description: description,
            value: value
        });
        await this.repository.save(data);
        return data;

    }
}