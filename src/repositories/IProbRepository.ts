import { Prob } from "../domain/products/probs";

export interface IProbRepository {
    save(data: Prob): Promise<Prob | null>;
    findAll(): Promise<Prob[]>;
    findById(id: string): Promise<Prob | null>;
    delete(id: string): Promise<boolean>;
}