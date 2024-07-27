import {cart_items as PersistenceData} from "@prisma/client";
import {CartItem} from "../domain/cart/cartItem";

export class ItemCartMap {
    public static toDomain(raw: PersistenceData): CartItem | null {
        const result = new CartItem({
            productId: raw.product_id,
            cartId: raw.cart_id,
            count: raw.count,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: CartItem): {
        id: string,
        product_id: string,
        cart_id: string,
        count: number,
        created_at: Date,
        updated_at: Date
    } {
        return {
            id: data.getId(),
            product_id: data.getProductId(),
            cart_id: data.getCartId(),
            count: data.getCount(),
            created_at: data.getCreatedAt(),
            updated_at: data.getUpdatedAt()
        }
    }
}