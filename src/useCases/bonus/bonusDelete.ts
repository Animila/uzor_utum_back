import {Bonus} from "../../domain/bonus/bonus";
import {IBonusRepository} from "../../repositories/IBonusRepository";
import {BonusMap} from "../../mappers/BonusMap";

interface DeleteBonusInput {
    id: string
}

export class DeleteBonus {
    private repository: IBonusRepository;

    constructor(repository: IBonusRepository) {
        this.repository = repository;
    }

    async execute(input: DeleteBonusInput): Promise<boolean> {
        const {id} = input;
        return await this.repository.delete(id);
    }
}