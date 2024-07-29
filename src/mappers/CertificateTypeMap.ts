import { certificate_types as PersistenceData } from "@prisma/client";
import {CertificateType} from "../domain/certificate/certificateType";



export class CertificateTypeMap {
    public static toDomain(raw: PersistenceData): CertificateType | null {
        const result = new CertificateType({
            value: raw.value,
            description: raw.description,
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: CertificateType): {
        id: string,
        value: number
        description: string
    } {
        return {
            id: data.getId(),
            value: data.getValue(),
            description: data.getDescription(),
        }
    }
}