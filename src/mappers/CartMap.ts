import {Cart} from "../domain/cart/cart";
import {carts as PersistenceData} from "@prisma/client";

export class CartMap {
    public static toDomain(raw: PersistenceData): Cart | null {
        const result = new Cart({
            userId: raw.user_id || undefined,
            token: raw.token,
            updatedAt: raw.updated_at,
            createdAt: raw.created_at,
            totalAmount: raw.total_amount
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Cart): {
        id: string,
        user_id?: string,
        token: string,
        total_amount: number,
        created_at: Date,
        updated_at: Date,
    } {
        return {
            id: data.getId(),
            user_id: data.getUserId(),
            token: data.getToken(),
            total_amount: data.getTotalAmount(),
            created_at: data.getCreatedAt(),
            updated_at: data.getUpdatedAt()
        }
    }
}