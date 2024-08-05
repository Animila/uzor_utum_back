import { materials as PersistenceData } from "@prisma/client";
import { Material } from "../domain/products/materials";


export class MaterialMap {
    public static toDomain(raw: PersistenceData): Material | null {
        const result = new Material({ title: raw.title }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Material): {
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