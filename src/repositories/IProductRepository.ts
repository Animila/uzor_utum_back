import { Product } from "../domain/products/product";

export interface IProductRepository {
    save(data: Product): Promise<Product | null>;
    findAll(categoryId?: string,
            materialId?: string,
            probIds?: string[],
            decorationIds?: string[],
            discount_at?: boolean,
            sizeIds?: string[],
            sortBy?: string,
            order?: "asc" | "desc",
            search?: string,
            minPrice?: number,
            maxPrice?: number, sex?: string, limit?: number, offset?: number): Promise<{data: Product[], count: number}>;
    findById(id: string): Promise<Product | null>;
    delete(id: string): Promise<boolean>;
}
