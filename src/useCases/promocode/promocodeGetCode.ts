import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";
import {PromoCodeMap} from "../../mappers/PromoCodeMap";
import {PromoCode} from "../../domain/promocode/promocode";

interface GetCodePromoCodeInput {
    code: string
}

export class GetByCodePromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(input: GetCodePromoCodeInput): Promise<PromoCode> {
        const { code } = input

        const existingData = await this.repository.findByCode(code)

        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Промокод не найден'
            }))
        }

        return existingData;
    }
}