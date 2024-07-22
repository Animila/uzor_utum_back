import { journals as PersistenceData } from "@prisma/client";
import { Journal } from "../domain/news/journal";
export class JournalMap {
    public static toDomain(raw: PersistenceData): Journal | null {
        const result = new Journal({ title: raw.title }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Journal): { id: string, title: string } {
        return {
            id: data.getId(),
            title: data.getTitle()
        }
    }
}