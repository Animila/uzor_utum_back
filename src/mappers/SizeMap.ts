import {materials as PersistenceMaterial} from "@prisma/client";
import {Size} from "../domain/products/sizes";


export class SizeMap {
    public static toDomain(raw: PersistenceMaterial): Size | null {
        const token = new Size({
            title: raw.title,
        }, raw.id)
        if(!token) return null
        return token
    }

    public static toPersistence(token: Size): {
        id: string,
        title: string
    } {
        return {
            id: token.getId(),
            title: token.getTitle()
        }
    }
}