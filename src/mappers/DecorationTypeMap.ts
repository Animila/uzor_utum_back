import {materials as PersistenceMaterial} from "@prisma/client";
import {DecorationType} from "../domain/products/decor_types";


export class DecorationTypeMap {
    public static toDomain(raw: PersistenceMaterial): DecorationType | null {
        const token = new DecorationType({
            title: raw.title,
        }, raw.id)
        if(!token) return null
        return token
    }

    public static toPersistence(token: DecorationType): {
        id: string,
        title: string
    } {
        return {
            id: token.getId(),
            title: token.getTitle()
        }
    }
}