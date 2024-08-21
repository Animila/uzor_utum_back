import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";
import {PromoCode} from "../../domain/promocode/promocode";

interface CreatePromoCodeInput {
    code: string
    description: string
    discount: number
    valid_to: Date
    valid_from: Date
    active: boolean
}

export class CreatePromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(input: CreatePromoCodeInput): Promise<PromoCode> {
        const { code, discount, description, active, valid_to, valid_from } = input

        const result = new PromoCode({
            code: code,
            description: description,
            discount: discount,
            validTo: valid_to,
            validFrom: valid_from,
            active: active
        })

        await this.repository.save(result)
        return result;
    }
}
