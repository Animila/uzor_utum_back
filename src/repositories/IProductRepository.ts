import {Product} from "../domain/products/product";

export interface IProductRepository {
    save(product: Product): Promise<Product| null>;
    findAll(categoryId?: string,
            materialId?: string,
            filters?: JSON,
            sortBy?: string,
            order?: "asc" | "desc",
            search?: string,
            minPrice?: number,
            maxPrice?: number): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    delete(id: string): Promise<boolean>;
}