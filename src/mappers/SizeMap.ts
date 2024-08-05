import { sizes as PersistenceData } from "@prisma/client";
import { Size } from "../domain/products/sizes";


export class SizeMap {
    public static toDomain(raw: PersistenceData): Size | null {
        const result = new Size({ title: raw.title }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Size): {
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