import { Size } from "../domain/products/sizes";

export interface ISizeRepository {
    save(data: Size): Promise<Size | null>;
    findAll(): Promise<Size[]>;
    findById(id: string): Promise<Size | null>;
    delete(id: string): Promise<boolean>;
}