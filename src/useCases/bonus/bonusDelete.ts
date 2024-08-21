import {IBonusRepository} from "../../repositories/IBonusRepository";

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
