import {Discount} from "../domain/discount/discount";

export interface IDiscountRepository {
    save(data: Discount): Promise<Discount| null>;
    findById(id: string): Promise<Discount | null>;
    findByProduct(productId: string): Promise<Discount | null>;
    delete(id: string): Promise<boolean>;
}