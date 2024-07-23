import {IDiscountRepository} from "../../repositories/IDiscountRepository";
import {Guard} from "../../domain/guard";

interface DeleteDiscountInput {
    id: string
}

export class DeleteDiscount {
    private repository: IDiscountRepository;

    constructor(repository: IDiscountRepository) {
        this.repository = repository;
    }

    async execute(input: DeleteDiscountInput): Promise<boolean> {
        const {id} = input;
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'id',
                        message: 'Нет id'
                    }
                ]
            }))
        return await this.repository.delete(id)

    }
}