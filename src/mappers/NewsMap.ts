import { news as PersistenceData } from "@prisma/client";
import { News } from "../domain/news/news";

export class NewsMap {
    public static toDomain(raw: PersistenceData): News | null {
        const result = new News({
            title: raw.title,
            text: raw.text,
            about: raw.about,
            journalId: raw.journal_id,
            views: raw.views,
            createdAt: raw.created_at
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: News): {
        id: string,
        title: string
        text: string
        about: string
        journal_id: string
        created_at: Date
        images?: any
        views:  number
    } {
        return {
            id: data.getId(),
            title: data.getTitle(),
            text: data.getText(),
            about: data.getAbout(),
            journal_id: data.getJournalId(),
            images: data.getImages(),
            views: data.getViews(),
            created_at: data.getCreatedAt()
        }
    }
}
