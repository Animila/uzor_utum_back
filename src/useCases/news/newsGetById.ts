import {INewsRepository} from "../../repositories/INewsRepository";
import {NewsMap} from "../../mappers/NewsMap";

interface GetByIdNewsInput {
    id: string
}

export class GetByIdNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdNewsInput): Promise<{
        id: string,
        title: string
        text: string
        about: string
        journal_id: string
        created_at: Date
        views:  number
    }> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }
        return NewsMap.toPersistence(existingData)
    }
}
