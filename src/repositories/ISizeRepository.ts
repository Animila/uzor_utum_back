import { Size } from "../domain/products/sizes";

export interface ISizeRepository {
    save(data: Size): Promise<Size | null>;
    findAll(limit: number, offset: number ): Promise<{data: Size[], count: number}>;
    findById(id: string): Promise<Size | null>;
    delete(id: string): Promise<boolean>;
}
