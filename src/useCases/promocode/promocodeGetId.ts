import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";
import {PromoCode} from "../../domain/promocode/promocode";

interface GetIdPromoCodeInput {
    id: string
}

export class GetByIdPromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(input: GetIdPromoCodeInput): Promise<PromoCode> {
        const { id } = input

        const existingData = await this.repository.findById(id)

        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Промокод не найден'
            }))
        }

        return existingData;
    }
}
