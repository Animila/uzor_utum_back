import {IBonusRepository} from "../../repositories/IBonusRepository";

interface GetByUserBonusSumInput {
    user_id: string
}

export class GetBySumUserBonus {
    private repository: IBonusRepository;

    constructor(repository: IBonusRepository) {
        this.repository = repository;
    }

    async execute(input: GetByUserBonusSumInput): Promise<number> {
        const {user_id} = input;
        return await this.repository.sum(user_id);

    }
}
