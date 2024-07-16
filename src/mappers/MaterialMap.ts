import {materials as PersistenceMaterial} from "@prisma/client";
import {Material} from "../domain/products/materials";


export class MaterialMap {
    public static toDomain(raw: PersistenceMaterial): Material | null {
        const token = new Material({
            title: raw.title,
        }, raw.id)
        if(!token) return null
        return token
    }

    public static toPersistence(token: Material): {
        id: string,
        title: string
    } {
        return {
            id: token.getId(),
            title: token.getTitle()
        }
    }
}