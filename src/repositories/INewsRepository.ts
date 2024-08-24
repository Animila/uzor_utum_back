import { News } from "../domain/news/news";

export interface INewsRepository {
    save(data: News): Promise<News | null>;
    findAll(limit: number, offset: number, journalId?: string, old?: boolean, popular?: boolean, search?: string): Promise<{data: News[], count: number}>;
    findById(id: string): Promise<News | null>;
    delete(id: string): Promise<boolean>;
}
