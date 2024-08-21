import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";
import {PromoCode} from "../../domain/promocode/promocode";

interface UpdatePromoCodeInput {
    id: string
    code?: string
    description?: string
    discount?: number
    valid_to?: Date
    valid_from?: Date
    active?: boolean
}

export class UpdatePromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(input: UpdatePromoCodeInput): Promise<PromoCode> {
        const { id, code, discount, description, active, valid_to, valid_from } = input

        const existingData =  await this.repository.findById(id)

        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Промокод не найден'
            }))
        }

        const result = new PromoCode({
            code: code || existingData.getCode(),
            description: description || existingData.getDescription(),
            discount: discount || existingData.getDiscount(),
            validTo: valid_to || existingData.getValidTo(),
            validFrom: valid_from || existingData.getValidFrom(),
            active: active || existingData.getActive(),
        }, existingData.getId())

        await this.repository.save(result)
        return result;
    }
}
