import {ILikeRepository} from "../../repositories/ILikeRepository";
import {Like} from "../../domain/like/like";
import {LikeType} from "../../domain/like/valueObjects/LikeType";
import {LikeMap} from "../../mappers/LikeMap";
import {User} from "../../domain/user/user";

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