import {ICertificateTypeRepository} from "../../repositories/ICertificateTypeRepository";
import {CertificateType} from "../../domain/certificate/certificateType";

interface GetByIdCertificateTypeInput {
    id: string,
}

export class GetByIdCertificateType {
    private repository: ICertificateTypeRepository;

    constructor(repository: ICertificateTypeRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdCertificateTypeInput): Promise<CertificateType> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Номинал не найден'
            }))
        }
        return existingData;
    }
}