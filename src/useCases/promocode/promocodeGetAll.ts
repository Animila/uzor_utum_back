import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";
import {PromoCodeMap} from "../../mappers/PromoCodeMap";

// interface GetAllPromoCodeInput {
//     code: string
//     description: string
//     discount: string
//     valid_to: Date
//     valid_from: Date
//     active: boolean
// }

export class GetAllPromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(): Promise<{
        id: string
        code: string
        description: string
        discount: number
        valid_to: Date
        valid_from: Date
        active: boolean
    }[]> {

        const existingData = await this.repository.findAll()
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Промокоды не найдены'
            }))
        }
        return existingData.map(item => PromoCodeMap.toPersistence(item)).filter(item =>  item !== null);
    }
}