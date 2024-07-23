import { promocodes as PersistenceData } from "@prisma/client";
import {PromoCode} from "../domain/promocode/promocode";


export class PromoCodeMap {
    public static toDomain(raw: PersistenceData): PromoCode | null {

        const result = new PromoCode({
            code: raw.code,
            description: raw.description,
            discount: raw.discount,
            validTo: raw.valid_to,
            validFrom: raw.valid_from,
            active: raw.active
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: PromoCode): {
        id: string,
        code: string,
        description: string,
        discount: number,
        valid_to: Date,
        valid_from: Date,
        active: boolean
    } {
        return {
            id: data.getId(),
            code: data.getCode(),
            description: data.getDescription(),
            discount: data.getDiscount(),
            valid_to: data.getValidTo(),
            valid_from: data.getValidFrom(),
            active: data.getActive()
        }
    }
}