import {Discount} from "../../domain/discount/discount";
import {IDiscountRepository} from "../../repositories/IDiscountRepository";

interface GetByProductIdDiscountInput {
    product_id: string
}

export class GetByProductIdDiscount {
    private repository: IDiscountRepository;

    constructor(repository: IDiscountRepository) {
        this.repository = repository;
    }

    async execute(input: GetByProductIdDiscountInput): Promise<Discount> {
        const {product_id} = input;

        const existingData = await this.repository.findByProduct(product_id)
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Скидка не найдена'
            }))

        return existingData;

    }
}