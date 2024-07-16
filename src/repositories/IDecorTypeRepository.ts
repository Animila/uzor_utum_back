import {DecorationType} from "../domain/products/decor_types";

export interface IDecorTypeRepository {
    save(decorationType: DecorationType): Promise<DecorationType| null>;
    findAll(): Promise<DecorationType[]>;
    findById(id: string): Promise<DecorationType | null>;
    findByTitle(title: string): Promise<DecorationType | null>;
    delete(id: string): Promise<boolean>;
}