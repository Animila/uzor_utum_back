import {Bonus} from "../domain/bonus/bonus";
import {bonuses as PersistenceData} from "@prisma/client";
import {BonusType} from "../domain/bonus/valueObjects/bonusType";

export class BonusMap {
    public static toDomain(raw: PersistenceData): Bonus | null {
        const typeOrError = BonusType.create(raw.type)


        if(typeOrError instanceof Error) return null
        const result = new Bonus({
            user_id: raw.user_id,
            count: raw.count,
            description: raw.description,
            created_at: raw.created_at,
            type: typeOrError
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Bonus): {
        id: string,
        user_id: string,
        count: number,
        description: string,
        created_at: Date,
        type: string
    } {
        return {
            id: data.getId(),
            count: data.getCount(),
            type: data.getType().getValue(),
            description: data.getDescription(),
            user_id: data.getUserid(),
            created_at: data.getCreatedAt()
        }
    }
}