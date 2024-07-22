import { categories as PersistenceData } from "@prisma/client";
import { Category } from "../domain/products/categories";


export class CategoryMap {
    public static toDomain(raw: PersistenceData): Category | null {
        const result = new Category({
            title: raw.title,
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Category): {
        id: string,
        title: string
    } {
        return {
            id: data.getId(),
            title: data.getTitle()
        }
    }
}