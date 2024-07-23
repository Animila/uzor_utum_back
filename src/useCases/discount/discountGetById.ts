import {Discount} from "../../domain/discount/discount";
import {IDiscountRepository} from "../../repositories/IDiscountRepository";

interface GetByIdDiscountInput {
    id: string
}

export class GetByIdDiscount {
    private repository: IDiscountRepository;

    constructor(repository: IDiscountRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdDiscountInput): Promise<Discount> {
        const {id} = input;

        const existingData = await this.repository.findById(id)
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Скидка не найдена'
            }))

        return existingData;

    }
}