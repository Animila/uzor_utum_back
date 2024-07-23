import {Bonus} from "../../domain/bonus/bonus";
import {IBonusRepository} from "../../repositories/IBonusRepository";
import {BonusMap} from "../../mappers/BonusMap";
import {BonusType} from "../../domain/bonus/valueObjects/bonusType";

interface GetByUserBonusSumInput {
    user_id?: string
}

export class GetAllBonus {
    private repository: IBonusRepository;

    constructor(repository: IBonusRepository) {
        this.repository = repository;
    }

    async execute(input: GetByUserBonusSumInput): Promise<{
        id: string
        type: string
        description: string
        count: number
        created_at: Date
        user_id: string
    }[]> {
        const {user_id} = input;
        const data = await this.repository.findAll(user_id);
        return data.map(item =>  BonusMap.toPersistence(item)).filter(item => item != null)
    }
}