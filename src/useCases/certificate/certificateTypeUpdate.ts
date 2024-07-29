import {ICertificateTypeRepository} from "../../repositories/ICertificateTypeRepository";
import {CertificateType} from "../../domain/certificate/certificateType";

interface UpdateCertificateInput {
    id: string
    value?: number
    description?: string
}

export class UpdateCertificateType {
    private repository: ICertificateTypeRepository;

    constructor(repository: ICertificateTypeRepository) {
        this.repository = repository;
    }

    async execute(input: UpdateCertificateInput): Promise<CertificateType> {
        const { id, value, description } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Номинал не найден'
            }))
        }

        const updateData = new CertificateType({
            value: value || existingData.getValue(),
            description: description || existingData.getDescription(),
        }, existingData.getId());

        const savedData = await this.repository.save(updateData);
        if(!savedData) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка обновления скидки'
            }))
        }
        return savedData;

    }
}