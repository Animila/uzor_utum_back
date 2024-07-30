import { Decorate } from "../domain/products/decorates";

export interface IDecorateRepository {
    save(data: Decorate): Promise<Decorate | null>;
    findAll(): Promise<Decorate[]>;
    findById(id: string): Promise<Decorate | null>;
    delete(id: string): Promise<boolean>;
}