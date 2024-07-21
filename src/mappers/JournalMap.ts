import {journals as PersistenceJournal } from "@prisma/client";
import {Journal} from "../domain/news/journal";
export class JournalMap {
    public static toDomain(raw: PersistenceJournal): Journal | null {
        const data = new Journal({ title: raw.title }, raw.id)
        if(!data) return null
        return data
    }

    public static toPersistence(domain: Journal): { id: string, title: string } {
        return {
            id: domain.getId(),
            title: domain.getTitle()
        }
    }
}