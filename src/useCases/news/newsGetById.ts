import {INewsRepository} from "../../repositories/INewsRepository";
import {News} from "../../domain/news/news";

interface GetByIdNewsInput {
    id: string
}

export class GetByIdNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdNewsInput): Promise<News> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }
        return existingData
    }
}
