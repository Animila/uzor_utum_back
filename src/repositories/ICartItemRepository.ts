import {CartItem} from "../domain/cart/cartItem";

export interface ICartItemRepository {
    save(data: CartItem): Promise<CartItem | null>;
    find(card_id?: string, id?: string): Promise<CartItem[]|CartItem|null>;
    delete(id: string): Promise<CartItem|null>;
}