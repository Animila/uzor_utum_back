import { Shop } from "../domain/shop/shop";

export interface IShopRepository {
    save(data: Shop): Promise<Shop | null>;
    findAll(limit: number, offset: number ): Promise<{data: Shop[], count: number}>;
    findById(id: string): Promise<Shop | null>;
    delete(id: string): Promise<boolean>;
}
