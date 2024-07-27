import {Cart} from "../domain/cart/cart";

export interface ICartRepository {
    save(data: Cart): Promise<Cart | null>;
    find(token?: string, userId?: string, id?: string): Promise<Cart | null>;
    delete(id: string): Promise<boolean>;
}