import {IReviewRepository} from "../../repositories/IReviewRepository";
import {Review} from "../../domain/review/review";

interface GetByIdReviewInput {
    id: string
}

export class GetByIdReview {
    private repository: IReviewRepository;

    constructor(repository: IReviewRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdReviewInput): Promise<Review> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайки не найдены'
            }))
        }
        return existingData;
    }
}
