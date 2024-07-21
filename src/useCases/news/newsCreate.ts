import {INewsRepository} from "../../repositories/INewsRepository";
import {News} from "../../domain/news/news";

interface CreateNewsInput {
    title: string
    text: string
    about: string
    journal_id: string
    preview_path: string
    views: number
}

export class CreateNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: CreateNewsInput): Promise<News> {
        const {
            title,
            journal_id,
            text,
            views,
            preview_path,
            about
        } = input;

        const result = new News({
            title: title,
            text: text,
            about: about,
            journalId: journal_id,
            previewPath: preview_path,
            views: views,
            createdAt: new Date(),
        });
        await this.repository.save(result);
        return result;

    }
}