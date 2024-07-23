import {Bonus} from "../domain/bonus/bonus";

export interface IBonusRepository {
    save(data: Bonus): Promise<Bonus | null>;
    findAll(user_id?: string): Promise<Bonus[]>;
    findById(id: string): Promise<Bonus | null>;
    sum(user_id?: string): Promise<number>;
    delete(id: string): Promise<boolean>;
}