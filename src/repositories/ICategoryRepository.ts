import {Category} from "../domain/products/categories";

export interface ICategoryRepository {
    save(category: Category): Promise<Category| null>;
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    findByTitle(title: string): Promise<Category | null>;
    delete(id: string): Promise<boolean>;
}