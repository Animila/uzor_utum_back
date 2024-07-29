import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {CertificateMap} from "../../mappers/CertificateMap";

interface GetAllCertificateInput {
    certificate_type_id?: string,
}

export class GetAllCertificate {
    private repository: ICertificateRepository;

    constructor(repository: ICertificateRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllCertificateInput): Promise<{
        id: string,
        certificate_type_id: string,
        code: string,
        activated: boolean,
        phone?: string,
        email?: string,
        user_id?: string,
        delivery_at: Date,
        accepted: boolean
    }[]> {
        const { certificate_type_id} = input;

        const existingData = await this.repository.findAll(certificate_type_id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Сертификаты не найдены'
            }))
        }
        return existingData.map(item => CertificateMap.toPersistence(item)).filter(item =>  item !== null);
    }
}