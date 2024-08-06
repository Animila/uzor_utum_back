import {cart_items as PersistenceData} from "@prisma/client";
import {CartItem} from "../domain/cart/cartItem";

export class ItemCartMap {
    public static toDomain(raw: PersistenceData): CartItem | null {
        const result = new CartItem({
            productId: raw.product_id,
            decorateId: raw.decorate_id || undefined,
            sizeId: raw.size_id || undefined,
            probaId: raw.proba_id || undefined,
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
        product?: any,
        size_id?: string,
        size?: any,
        decorate_id?: string,
        decorate?: any,
        proba_id?: string,
        proba?: any,
        cart_id: string,
        cart?: any,
        count: number,
        created_at: Date,
        updated_at: Date
    } {
        return {
            id: data.getId(),
            product_id: data.getProductId(),
            decorate_id: data.getDecorateId(),
            proba_id: data.getProbaId(),
            size_id: data.getSizeId(),
            cart_id: data.getCartId(),
            count: data.getCount(),
            created_at: data.getCreatedAt(),
            updated_at: data.getUpdatedAt()
        }
    }
}