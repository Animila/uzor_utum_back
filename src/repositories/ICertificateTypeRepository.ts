import { CertificateType } from "../domain/certificate/certificateType";

export interface ICertificateTypeRepository {
    save(certificateType: CertificateType): Promise<CertificateType | null>;
    findAll(limit: number, offset: number ): Promise<{data: CertificateType[], count: number}>;
    findById(id: string): Promise<CertificateType | null>;
    delete(id: string): Promise<boolean>;
}
