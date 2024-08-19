import {ILikeRepository} from "../../repositories/ILikeRepository";
import {LikeMap} from "../../mappers/LikeMap";

interface GetAllLikeInput {
    entity_type: string,
    entity_id: string,
    user_id: string
    type?: string
}

export class GetAllLike {
    private repository: ILikeRepository;

    constructor(repository: ILikeRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllLikeInput): Promise<{
        id: string
        entity_type: string,
        entity_id: string,
        user_id: string,
        type: string,
        created_at: Date,
    }[]> {
        const { entity_id, entity_type, user_id, type} = input;

        const existingData = await this.repository.findAll(entity_type, entity_id, user_id, type)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайки не найдены'
            }))
        }
        return existingData.map(item => LikeMap.toPersistence(item)).filter(item =>  item !== null);
    }
}
