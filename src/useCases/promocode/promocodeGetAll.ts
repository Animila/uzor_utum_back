import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";
import {PromoCodeMap} from "../../mappers/PromoCodeMap";

export class GetAllPromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(limit: number = 10, offset: number = 0): Promise<{
        data: {
            id: string
            code: string
            description: string
            discount: number
            valid_to: Date
            valid_from: Date
            active: boolean
        }[],
        count: number
    }> {

        const existingData = await this.repository.findAll(limit, offset)
        if(!existingData.data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Промокоды не найдены'
            }))
        }
        return {
            data: existingData.data.map(item => PromoCodeMap.toPersistence(item)).filter(item =>  item !== null),
            count: existingData.count
        }
    }
}
