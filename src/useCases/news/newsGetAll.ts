import {INewsRepository} from "../../repositories/INewsRepository";
import {NewsMap} from "../../mappers/NewsMap";

interface GetAllNewsInput {
    old?: boolean
    popular?: boolean
    journal_id?: string
}

export class GetAllNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllNewsInput): Promise<{
        id: string,
        title: string
        text: string
        about: string
        journal_id: string
        created_at: Date
        views:  number
    }[]> {
        const {
            old,
            popular,
            journal_id
        } = input;

        const existingData = await this.repository.findAll(journal_id, old, popular)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }

        return existingData.map(item => {
            return NewsMap.toPersistence(item)
        });

    }
}
