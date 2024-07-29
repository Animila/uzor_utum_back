import { certificates as PersistenceData } from "@prisma/client";
import { Certificate } from "../domain/certificate/certificate";


export class CertificateMap {
    public static toDomain(raw: PersistenceData): Certificate | null {
        const result = new Certificate({
            phone: raw.phone || undefined,
            email: raw.email || undefined,
            userId: raw.user_id  || undefined,
            deliveryAt: raw.delivery_at,
            accepted: raw.accepted,
            certificateTypeId: raw.certificate_type_id,
            code: raw.code,
            activated: raw.activated
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Certificate): {
        id: string,
        certificate_type_id: string
        code: string
        activated: boolean
        phone?: string
        email?: string
        user_id?: string
        delivery_at: Date
        accepted: boolean
    } {
        return {
            id: data.getId(),
            certificate_type_id: data.getCertificateTypeId(),
            code: data.getCode(),
            activated: data.getActivated(),
            accepted: data.getAccepted(),
            email: data.getEmail(),
            phone: data.getPhone(),
            delivery_at: data.getDeliveryAt(),
            user_id: data.getUserId(),
        }
    }
}