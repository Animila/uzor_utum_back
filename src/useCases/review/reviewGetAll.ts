import {IReviewRepository} from "../../repositories/IReviewRepository";
import {ReviewMap} from "../../mappers/ReviewMap";

interface GetAllReviewInput {
    user_id?: string,
    product_id?: string,
    old?: boolean,
    popular?: boolean
}

export class GetAllReview {
    private repository: IReviewRepository;

    constructor(repository: IReviewRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllReviewInput): Promise<{
        id: string,
        name: string,
        url: string,
        rating: number,
        text: string,
        created_at: Date,
        published_at?: Date,
        product_id: string,
        order_id: string,
        images?: any
    }[]> {
        const { user_id, product_id, old, popular} = input;

        const existingData = await this.repository.findAll(user_id, product_id, old, popular)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайки не найдены'
            }))
        }
        return existingData.map(item => ReviewMap.toPersistence(item)).filter(item =>  item !== null);
    }
}
