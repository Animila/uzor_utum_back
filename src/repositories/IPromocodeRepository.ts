import {PromoCode} from "../domain/promocode/promocode";

export interface IPromocodeRepository {
    save(data: PromoCode): Promise<PromoCode | null>;
    findAll(limit: number, offset: number ): Promise<{data: PromoCode[], count: number}>;
    findByCode(code: string): Promise<PromoCode | null>;
    findById(id: string): Promise<PromoCode | null>;
    usedAsPromoCode(id: string, user_id?: string, email?: string, phone?: string): Promise<boolean|PromoCode>
    delete(id: string): Promise<boolean>;
}
