import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";

interface DeletePromoCodeInput {
    id: string
}

export class DeletePromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(input: DeletePromoCodeInput): Promise<boolean> {
        const { id } = input
        return await this.repository.delete(id)
    }
}
