import { Like } from "../domain/like/like";

export interface ILikeRepository {
    save(data: Like): Promise<Like | null>;
    findAll(entity_type?: string, entity_id?: string, user_id?: string, type?: string): Promise<Like[] | null>;
    findById(id: string): Promise<Like | null>;
    delete(id: string): Promise<boolean>;
}
