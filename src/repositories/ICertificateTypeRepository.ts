import { CertificateType } from "../domain/certificate/certificateType";

export interface ICertificateTypeRepository {
    save(certificateType: CertificateType): Promise<CertificateType | null>;
    findAll(): Promise<CertificateType[]>;
    findById(id: string): Promise<CertificateType | null>;
    delete(id: string): Promise<boolean>;
}