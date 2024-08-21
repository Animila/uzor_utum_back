import { Prob } from "../domain/products/probs";

export interface IProbRepository {
    save(data: Prob): Promise<Prob | null>;
    findAll(limit: number, offset: number ): Promise<{data: Prob[], count: number}>;
    findById(id: string): Promise<Prob | null>;
    delete(id: string): Promise<boolean>;
}
