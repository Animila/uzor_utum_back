import {ILikeRepository} from "../../repositories/ILikeRepository";
import {LikeMap} from "../../mappers/LikeMap";

interface GetAllLikeInput {
    entity_type: string,
    entity_id: string,
    user_id: string
    type?: string,
    limit: number
    offset: number
}

export class GetAllLike {
    private repository: ILikeRepository;

    constructor(repository: ILikeRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllLikeInput): Promise<{
        data: {
            id: string
            entity_type: string,
            entity_id: string,
            user_id: string,
            type: string,
            entity?: any,
            created_at: Date
        }[],
        count: number
    }> {
        const { entity_id, entity_type, user_id, type, limit = 10, offset = 0} = input;

        const existingData = await this.repository.findAll( limit, offset, entity_type, entity_id, user_id, type)
        if(!existingData.data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайки не найдены'
            }))
        }
        return {
            data: existingData.data.map(item => LikeMap.toPersistence(item)).filter(item =>  item !== null),
            count: existingData.count
        };
    }
}
