import { decorations as PersistenceData } from "@prisma/client";
import { Decorate } from "../domain/products/decorates";


export class DecorateMap {
    public static toDomain(raw: PersistenceData): Decorate | null {
        const result = new Decorate({ title: raw.title,  }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Decorate): {
        id: string,
        title: string,
        images?: any
    } {
        return {
            id: data.getId(),
            title: data.getTitle()
        }
    }
}