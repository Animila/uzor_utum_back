import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {Certificate} from "../../domain/certificate/certificate";

interface GetByCodeCertificateInput {
    code: string,
}

export class GetByCodeCertificate {
    private repository: ICertificateRepository;

    constructor(repository: ICertificateRepository) {
        this.repository = repository;
    }

    async execute(input: GetByCodeCertificateInput): Promise<Certificate> {
        const { code } = input;

        const existingData = await this.repository.findByCode(code)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Сертификат не найден'
            }))
        }
        return existingData;
    }
}