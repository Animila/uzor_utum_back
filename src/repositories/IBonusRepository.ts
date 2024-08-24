import {Bonus} from "../domain/bonus/bonus";

export interface IBonusRepository {
    save(data: Bonus): Promise<Bonus | null>;
    findAll(limit: number, offset: number, user_id?: string, old?: boolean): Promise<{data: Bonus[], count: number}>;
    findById(id: string): Promise<Bonus | null>;
    sum(user_id?: string): Promise<number>;
    delete(id: string): Promise<boolean>;
}
