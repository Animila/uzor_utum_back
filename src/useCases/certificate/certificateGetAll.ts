import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {CertificateMap} from "../../mappers/CertificateMap";

interface GetAllCertificateInput {
    certificate_type_id?: string,
    limit: number,
    offset: number
    search?: string
}

export class GetAllCertificate {
    private repository: ICertificateRepository;

    constructor(repository: ICertificateRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllCertificateInput): Promise<{
        data: {
            id: string,
            certificate_type_id: string,
            code: string,
            activated: boolean,
            phone?: string,
            email?: string,
            user_id?: string,
            delivery_at: Date,
            accepted: boolean
        }[],
        count: number
    }> {
        const { certificate_type_id, limit = 10, offset = 0, search} = input;

        const existingData = await this.repository.findAll(limit, offset, certificate_type_id, search)
        if(!existingData.data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Сертификаты не найдены'
            }))
        }
        const result =  existingData.data.map(item => CertificateMap.toPersistence(item)).filter(item =>  item !== null);
        return {
            data: result,
            count: existingData.count
        }
    }
}
