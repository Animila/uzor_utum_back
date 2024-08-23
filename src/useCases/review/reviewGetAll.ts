import {IReviewRepository} from "../../repositories/IReviewRepository";
import {ReviewMap} from "../../mappers/ReviewMap";

interface GetAllReviewInput {
    user_id?: string,
    product_id?: string,
    old?: boolean,
    popular?: boolean
    limit: number,
    offset: number
}

export class GetAllReview {
    private repository: IReviewRepository;

    constructor(repository: IReviewRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllReviewInput): Promise<{
        data: {
            id: string,
            name: string,
            url: string,
            rating: number,
            text: string,
            created_at: Date,
            published_at?: Date,
            product_id: string,
            product?: any,
            order_id: string,
            order?: any,
            images?: any
        }[],
        count: number
    }> {
        const { user_id, product_id, old, popular, limit = 10, offset = 0} = input;

        const existingData = await this.repository.findAll(limit, offset, user_id, product_id, old, popular)
        if(!existingData.data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайки не найдены'
            }))
        }
        return {
            data: existingData.data.map(item => ReviewMap.toPersistence(item)).filter(item =>  item !== null),
            count: existingData.count
        }
    }
}
