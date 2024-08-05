import { probs as PersistenceData } from "@prisma/client";
import { Prob } from "../domain/products/probs";


export class ProbMap {
    public static toDomain(raw: PersistenceData): Prob | null {
        const result = new Prob({ title: raw.title }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Prob): {
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