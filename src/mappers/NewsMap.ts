import {news as PersistenceNews } from "@prisma/client";
import {News} from "../domain/news/news";
export class NewsMap {
    public static toDomain(raw: PersistenceNews): News | null {
        const data = new News({
            title: raw.title,
            text: raw.text,
            about: raw.about,
            journalId: raw.journal_id,
            views: raw.views,
            previewPath: raw.preview_path,
            createdAt: raw.created_at
        }, raw.id)
        if(!data) return null
        return data
    }

    public static toPersistence(domain: News): {
        id: string,
        title: string
        text: string
        about: string
        journalId: string
        previewPath: string
        createdAt: Date
        views:  number
    } {
        return {
            id: domain.getId(),
            title: domain.getTitle(),
            text: domain.getText(),
            about: domain.getAbout(),
            journalId: domain.getJournalId(),
            views: domain.getViews(),
            previewPath: domain.getPreviewPath(),
            createdAt: domain.getCreatedAt()
        }
    }
}