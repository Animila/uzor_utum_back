import {Bonus} from "../../domain/bonus/bonus";
import {IBonusRepository} from "../../repositories/IBonusRepository";

interface GetByIdBonusInput {
    id: string
}

export class GetByIdBonus {
    private repository: IBonusRepository;

    constructor(repository: IBonusRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdBonusInput): Promise<Bonus> {
        const {id} = input;
        const data = await this.repository.findById(id);
        if(!data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Бонус не найден'
            }))
        }
        return data
    }
}
