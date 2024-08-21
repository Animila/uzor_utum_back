import { Category } from "../domain/products/categories";

export interface ICategoryRepository {
    save(data: Category): Promise<Category | null>;
    findAll(limit: number, offset: number): Promise<{data: Category[], count: number}>;
    findById(id: string): Promise<Category | null>;
    findByTitle(title: string): Promise<Category | null>;
    delete(id: string): Promise<boolean>;
}
