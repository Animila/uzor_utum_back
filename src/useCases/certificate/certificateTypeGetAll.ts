import {ICertificateTypeRepository} from "../../repositories/ICertificateTypeRepository";
import {CertificateTypeMap} from "../../mappers/CertificateTypeMap";

export class GetAllCertificateType {
    private repository: ICertificateTypeRepository;

    constructor(repository: ICertificateTypeRepository) {
        this.repository = repository;
    }

    async execute(): Promise<{
        id: string,
        value: number,
        description: string
    }[]> {

        const existingData = await this.repository.findAll()
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Номиналы не найдены'
            }))
        }
        return existingData.map(item => CertificateTypeMap.toPersistence(item)).filter(item =>  item !== null);
    }
}