import {ICertificateTypeRepository} from "../../repositories/ICertificateTypeRepository";

interface DeleteCertificateTypeInput {
    id: string,
}

export class DeleteCertificateType {
    private repository: ICertificateTypeRepository;

    constructor(repository: ICertificateTypeRepository) {
        this.repository = repository;
    }

    async execute(input: DeleteCertificateTypeInput): Promise<boolean> {
        const { id } = input;

        const existingData = await this.repository.delete(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Номинал не найден'
            }))
        }
        return existingData;
    }
}