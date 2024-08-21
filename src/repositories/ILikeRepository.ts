import { Like } from "../domain/like/like";

export interface ILikeRepository {
    save(data: Like): Promise<Like | null>;
    findAll(limit: number, offset: number, entity_type?: string, entity_id?: string, user_id?: string, type?: string): Promise<{
        data: Like[] | null,
        count: number
    }>;
    findById(id: string): Promise<Like | null>;
    delete(id: string): Promise<boolean>;
}
