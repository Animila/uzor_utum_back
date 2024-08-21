import {INewsRepository} from "../../repositories/INewsRepository";
import {NewsMap} from "../../mappers/NewsMap";

interface GetAllNewsInput {
    old?: boolean
    popular?: boolean
    journal_id?: string,
    limit: number,
    offset: number
}

export class GetAllNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllNewsInput): Promise<{
        data: {
            id: string,
            title: string
            text: string
            about: string
            journal_id: string
            created_at: Date
            images?: any
            views:  number
        }[],
        count: number
    }> {
        const {
            old,
            popular,
            journal_id,
            limit = 10, offset = 0
        } = input;

        const existingData = await this.repository.findAll(limit, offset, journal_id, old, popular)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }

        return {
            data: existingData.data.map(item => {
                return NewsMap.toPersistence(item)
            }),
            count: existingData.count
        }

    }
}
