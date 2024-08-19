import {INewsRepository} from "../../repositories/INewsRepository";
import {News} from "../../domain/news/news";

interface UpdateNewsInput {
    id: string
    title?: string
    text?: string
    about?: string
    journal_id?: string
    views?: number
}

export class UpdateNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: UpdateNewsInput): Promise<News> {
        const {
            id,
            title,
            journal_id,
            text,
            views,
            about
        } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }

        const result = new News({
            title: title || existingData.getTitle(),
            text: text || existingData.getText(),
            about: about || existingData.getAbout(),
            journalId: journal_id || existingData.getJournalId(),
            views: views || existingData.getViews(),
            createdAt: existingData.getCreatedAt(),
        }, existingData.getId());
        await this.repository.save(result);
        return result;

    }
}
