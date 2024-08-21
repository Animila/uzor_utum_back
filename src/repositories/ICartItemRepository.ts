import {CartItem} from "../domain/cart/cartItem";

export interface ICartItemRepository {
    save(data: CartItem): Promise<CartItem | null>;
    find(limit: number, offset: number, card_id?: string, id?: string): Promise<{data: CartItem[]|CartItem|null, count: number}>;
    delete(id: string): Promise<CartItem|null>;
}
