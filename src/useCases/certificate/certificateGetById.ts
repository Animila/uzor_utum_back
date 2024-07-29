import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {Certificate} from "../../domain/certificate/certificate";

interface GetByIdCertificateInput {
    id: string,
}

export class GetByIdCertificate {
    private repository: ICertificateRepository;

    constructor(repository: ICertificateRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdCertificateInput): Promise<Certificate> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Сертификат не найден'
            }))
        }
        return existingData;
    }
}