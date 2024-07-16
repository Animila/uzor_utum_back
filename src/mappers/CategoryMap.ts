import {categories as PersistenceCategory} from "@prisma/client";
import {Category} from "../domain/products/categories";


export class CategoryMap {
    public static toDomain(raw: PersistenceCategory): Category | null {
        const token = new Category({
            title: raw.title,
        }, raw.id)
        if(!token) return null
        return token
    }

    public static toPersistence(token: Category): {
        id: string,
        title: string
    } {
        return {
            id: token.getId(),
            title: token.getTitle()
        }
    }
}