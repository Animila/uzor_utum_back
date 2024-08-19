import { certificates as PersistenceData } from "@prisma/client";
import { Certificate } from "../domain/certificate/certificate";
import {Email} from "../domain/certificate/valueObjects/email";
import {Phone} from "../domain/certificate/valueObjects/phone";


export class CertificateMap {
    public static toDomain(raw: PersistenceData): Certificate | null {
        const emailOrError = raw.email ? Email.create(raw.email) : undefined
        const phoneOrError = raw.phone ? Phone.create(raw.phone) : undefined

        if(emailOrError instanceof Error || phoneOrError instanceof Error) return null

        const result = new Certificate({
            phone: phoneOrError,
            email: emailOrError,
            userId: raw.user_id  || undefined,
            deliveryAt: raw.delivery_at,
            accepted: raw.accepted,
            certificateTypeId: raw.certificate_type_id,
            code: raw.code,
            activated: raw.activated,
            orderId: raw.order_id || undefined
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Certificate): {
        id: string,
        certificate_type_id: string
        certificate_type?: any
        code: string
        activated: boolean
        phone?: string
        email?: string
        user_id?: string
        delivery_at: Date
        accepted: boolean
        order_id?: string
    } {
        return {
            id: data.getId(),
            certificate_type_id: data.getCertificateTypeId(),
            code: data.getCode(),
            activated: data.getActivated(),
            accepted: data.getAccepted(),
            email: data.getEmail()?.getFull(),
            phone: data.getPhone()?.getFullPhone(),
            delivery_at: data.getDeliveryAt(),
            user_id: data.getUserId(),
            order_id: data.getOrderId()
        }
    }
}
