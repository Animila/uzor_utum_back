import { Certificate } from "../domain/certificate/certificate";

export interface ICertificateRepository {
    save(certificate: Certificate): Promise<Certificate | null>;
    findAll(certificate_type_id?: string): Promise<Certificate[]>;
    findById(id: string): Promise<Certificate | null>;
    delete(id: string): Promise<boolean>;
}