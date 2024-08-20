import {IReviewRepository} from "../../repositories/IReviewRepository";
import {ReviewMap} from "../../mappers/ReviewMap";
import {Review} from "../../domain/review/review";

interface CreateReviewInput {
    name: string
    rating: number
    product_id: string
    text: string
    order_id: string
    url: string
}

export class CreateReview {
    private repository: IReviewRepository;

    constructor(repository: IReviewRepository) {
        this.repository = repository;
    }

    async execute(input: CreateReviewInput): Promise<Review> {
        const { product_id, rating, text, order_id, name, url} = input;

        const review = new Review({
            orderId: order_id,
            productId: product_id,
            publishedAt: new Date(),
            rating: rating,
            text: text,
            name: name,
            url: url,
            createdAt: new Date(),
        })

        const existingData = await this.repository.save(review)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Отзывы не найдены'
            }))
        }
        return existingData;
    }
}
