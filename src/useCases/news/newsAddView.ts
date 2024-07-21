import {INewsRepository} from "../../repositories/INewsRepository";
import {News} from "../../domain/news/news";
import {NewsMap} from "../../mappers/NewsMap";

interface AddViewNewsInput {
    id: string
}

export class AddViewNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: AddViewNewsInput): Promise<void> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }

        existingData.setView()

        await this.repository.save(existingData)
    }
}