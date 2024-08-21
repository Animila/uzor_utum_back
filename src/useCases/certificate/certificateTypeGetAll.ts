import {ICertificateTypeRepository} from "../../repositories/ICertificateTypeRepository";
import {CertificateTypeMap} from "../../mappers/CertificateTypeMap";

interface GetAllCertificateTypeInput {
    limit: number,
    offset: number
}

export class GetAllCertificateType {
    private repository: ICertificateTypeRepository;

    constructor(repository: ICertificateTypeRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllCertificateTypeInput): Promise<{
        data: {
            id: string,
            value: number,
            description: string
        }[],
        count: number
    }> {
        const {limit = 10, offset= 0} = input

        const existingData = await this.repository.findAll(limit, offset)
        if(!existingData.data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Номиналы не найдены'
            }))
        }
        return {
            data: existingData.data.map(item => CertificateTypeMap.toPersistence(item)).filter(item =>  item !== null),
            count: existingData.count
        }
    }
}
