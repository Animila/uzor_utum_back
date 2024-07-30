import { Shop } from "../domain/shop/shop";

export interface IShopRepository {
    save(data: Shop): Promise<Shop | null>;
    findAll(): Promise<Shop[]>;
    findById(id: string): Promise<Shop | null>;
    delete(id: string): Promise<boolean>;
}