import {Journal} from "../domain/news/journal";

export interface IJournalRepository {
    save(data: Journal): Promise<Journal| null>;
    findAll(): Promise<Journal[]>;
    findById(id: string): Promise<Journal | null>;
    delete(id: string): Promise<boolean>;
}