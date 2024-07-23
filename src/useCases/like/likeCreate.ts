import {ILikeRepository} from "../../repositories/ILikeRepository";
import {Like} from "../../domain/like/like";
import {LikeType} from "../../domain/like/valueObjects/LikeType";

interface CreateLikeInput {
    entity_type: string,
    entity_id: string,
    user_id: string,
    type: string,
}

export class CreateLike {
    private repository: ILikeRepository;

    constructor(repository: ILikeRepository) {
        this.repository = repository;
    }

    async execute(input: CreateLikeInput): Promise<Like> {
        const {
            type,
            user_id,
            entity_id,
            entity_type
        } = input;

        console.log(type,
            user_id,
            entity_id,
            entity_type)

        const typeOfError = LikeType.create(type)

        if(typeOfError instanceof Error)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'type',
                        message: 'Неправильный формат процентов'
                    }
                ]
            }))

        const data = new Like({
            entityType: entity_type,
            entityId: entity_id,
            type: typeOfError as LikeType,
            userId: user_id,
            createdAt: new Date(),
        });
        await this.repository.save(data);
        return data;

    }
}