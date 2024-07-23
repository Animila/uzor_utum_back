import {ILikeRepository} from "../../repositories/ILikeRepository";
import {Like} from "../../domain/like/like";
import {LikeType} from "../../domain/like/valueObjects/LikeType";

interface UpdateLikeInput {
    id: string
    entity_type?: string,
    entity_id?: string,
    user_id?: string,
    type?: string,
}

export class UpdateLike {
    private repository: ILikeRepository;

    constructor(repository: ILikeRepository) {
        this.repository = repository;
    }

    async execute(input: UpdateLikeInput): Promise<Like> {
        const {
            id,
            type,
            user_id,
            entity_id,
            entity_type
        } = input;


        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайк не найден'
            }))
        }

        const typeOfError = type ? LikeType.create(type) : undefined

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
            entityType: entity_type || existingData.getEntityType(),
            entityId: entity_id || existingData.getEntityId(),
            type: typeOfError || existingData.getType(),
            userId: user_id || existingData.getUserId(),
            createdAt: existingData.getCreatedAt(),
        }, existingData.getId());
        await this.repository.save(data);
        return data;

    }
}