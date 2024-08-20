import {Review} from "../domain/review/review";

export interface IReviewRepository {
    save(data: Review): Promise<Review | null>;
    findAll(user_id?: string, product_id?: string, old?: boolean, popular?: boolean): Promise<Review[]>;
    findById(id: string): Promise<Review | null>;
    delete(id: string): Promise<boolean>;
}
