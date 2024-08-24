import {IBonusRepository} from "../../repositories/IBonusRepository";
import {BonusMap} from "../../mappers/BonusMap";

interface GetByUserBonusSumInput {
    user_id?: string
    limit: number,
    offset: number
    old?: boolean
}

export class GetAllBonus {
    private repository: IBonusRepository;

    constructor(repository: IBonusRepository) {
        this.repository = repository;
    }

    async execute(input: GetByUserBonusSumInput): Promise<{
        data: {
            id: string
            type: string
            description: string
            count: number
            created_at: Date
            user_id: string
        }[],
        count: number
    }> {
        const {user_id, limit = 10, offset = 0, old} = input;
        const data = await this.repository.findAll(limit, offset, user_id, old);
        return {
            data: data.data.map(item =>  BonusMap.toPersistence(item)).filter(item => item != null),
            count: data.count
        }
    }
}
