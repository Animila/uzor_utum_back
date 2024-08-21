import {Review} from "../domain/review/review";

export interface IReviewRepository {
    save(data: Review): Promise<Review | null>;
    findAll(limit: number, offset: number, user_id?: string, product_id?: string, old?: boolean, popular?: boolean): Promise<{data: Review[], count: number}>;
    findById(id: string): Promise<Review | null>;
    delete(id: string): Promise<boolean>;
}
