import {Discount} from "../../domain/discount/discount";
import {IDiscountRepository} from "../../repositories/IDiscountRepository";

interface CreateDiscountInput {
    product_id: string
    percentage: number
    start_date: Date
    end_date: Date
    activated: boolean
}

export class CreateDiscount {
    private repository: IDiscountRepository;

    constructor(repository: IDiscountRepository) {
        this.repository = repository;
    }

    async execute(input: CreateDiscountInput): Promise<Discount> {
        const {
            product_id,
            percentage,
            start_date,
            end_date,
            activated
        } = input;

        const percentageFloat = parseFloat(percentage.toString())

        if(!percentageFloat)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'percentage',
                        message: 'Неправильный формат процентов'
                    }
                ]
            }))

        const data = new Discount({
            productId: product_id,
            percentage: percentageFloat,
            startDate: start_date,
            endDate: end_date,
            activated: activated
        });
        await this.repository.save(data);
        return data;

    }
}