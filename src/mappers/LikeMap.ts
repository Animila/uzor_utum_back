import { likes as PersistenceData } from "@prisma/client";
import { Like } from "../domain/like/like";
import { LikeType } from "../domain/like/valueObjects/LikeType";


export class LikeMap {
    public static toDomain(raw: PersistenceData): Like | null {
        const typeOrError = LikeType.create(raw.type)
        if(typeOrError instanceof Error) return null

        const result = new Like({
            entityType: raw.entity_type,
            entityId: raw.entity_id,
            userId: raw.user_id,
            type: typeOrError,
            createdAt: raw.created_at
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Like): {
        id: string,
        entity_type: string,
        entity_id: string,
        user_id: string,
        type: string,
        created_at: Date
    } {
        return {
            id: data.getId(),
            entity_type: data.getEntityType(),
            entity_id: data.getEntityId(),
            type: data.getType().getValue(),
            user_id: data.getUserId(),
            created_at: data.getCreatedAt()
        }
    }
}