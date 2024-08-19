import {Discount} from "../../domain/discount/discount";
import {IDiscountRepository} from "../../repositories/IDiscountRepository";

interface UpdateDiscountInput {
    id: string
    product_id?: string
    percentage?: number
    start_date?: Date
    end_date?: Date
    activated?: boolean
}

export class UpdateDiscount {
    private repository: IDiscountRepository;

    constructor(repository: IDiscountRepository) {
        this.repository = repository;
    }

    async execute(input: UpdateDiscountInput): Promise<Discount> {
        const {
            id,
            product_id,
            percentage,
            start_date,
            end_date,
            activated
        } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Сикдка не найдена'
            }))
        }

        const updateData = new Discount({
            productId: product_id || existingData.getProductId(),
            percentage: percentage || existingData.getPercentage(),
            activated: activated || existingData.getActivated(),
            startDate: start_date || existingData.getStartDate(),
            endDate: end_date || existingData.getEndDate()
        }, existingData.getId())

        const savedData = await this.repository.save(updateData);
        if(!savedData) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка обновления скидки'
            }))
        }
        return savedData;

    }
}
