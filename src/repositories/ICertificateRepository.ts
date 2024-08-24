import { Certificate } from "../domain/certificate/certificate";

export interface ICertificateRepository {
    save(certificate: Certificate): Promise<Certificate | null>;
    findAll(limit: number, offset: number, certificate_type_id?: string, search?: string): Promise<{data: Certificate[], count: number}>;
    findById(id: string): Promise<Certificate | null>;
    findByCode(code: string): Promise<Certificate | null>;
    delete(id: string): Promise<boolean>;
}
