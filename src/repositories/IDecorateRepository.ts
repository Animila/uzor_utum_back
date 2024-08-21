import { Decorate } from "../domain/products/decorates";

export interface IDecorateRepository {
    save(data: Decorate): Promise<Decorate | null>;
    findAll(limit: number, offset: number ): Promise<{data: Decorate[], count: number}>;
    findById(id: string): Promise<Decorate | null>;
    delete(id: string): Promise<boolean>;
}
