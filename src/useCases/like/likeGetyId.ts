import {ILikeRepository} from "../../repositories/ILikeRepository";
import {LikeMap} from "../../mappers/LikeMap";

interface GetByIdLikeInput {
    id: string,
}

export class GetByIdLike {
    private repository: ILikeRepository;

    constructor(repository: ILikeRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdLikeInput): Promise<{
        id: string
        entity_type: string,
        entity_id: string,
        user_id: string,
        type: string,
        created_at: Date,
        entity?: any
    }> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайк не найден'
            }))
        }
        return LikeMap.toPersistence(existingData);
    }
}
