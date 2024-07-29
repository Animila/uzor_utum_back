import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {Certificate} from "../../domain/certificate/certificate";

interface DeleteCertificateInput {
    id: string,
}

export class DeleteCertificate {
    private repository: ICertificateRepository;

    constructor(repository: ICertificateRepository) {
        this.repository = repository;
    }

    async execute(input: DeleteCertificateInput): Promise<boolean> {
        const { id } = input;

        const existingData = await this.repository.delete(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Сертификат не найден'
            }))
        }
        return existingData;
    }
}