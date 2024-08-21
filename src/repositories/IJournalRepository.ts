import { Journal } from "../domain/news/journal";

export interface IJournalRepository {
    save(data: Journal): Promise<Journal | null>;
    findAll(limit: number, offset: number ): Promise<{data: Journal[], count: number}>;
    findById(id: string): Promise<Journal | null>;
    delete(id: string): Promise<boolean>;
}
