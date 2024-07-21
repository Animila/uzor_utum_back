import {News} from "../domain/news/news";

export interface INewsRepository {
    save(data: News): Promise<News| null>;
    findAll(journalId?: string, old?: boolean, popular?: boolean): Promise<News[]>;
    findById(id: string): Promise<News | null>;
    delete(id: string): Promise<boolean>;
}