import {IPromocodeRepository} from "../../repositories/IPromocodeRepository";
import {PromoCode} from "../../domain/promocode/promocode";
import {Guard} from "../../domain/guard";

interface GetIdPromoCodeInput {
    id: string,
    user_id?: string,
    email?: string,
    phone?: string,
}

export class GetByIdPromoCode {
    private repository: IPromocodeRepository;

    constructor(repository: IPromocodeRepository) {
        this.repository = repository;
    }

    async execute(input: GetIdPromoCodeInput): Promise<PromoCode|boolean> {
        const { id, email, phone, user_id } = input

        const checkRes = Guard.againstNullOrUndefinedBulk([
            {argumentName: 'email', argument: email},
            {argumentName: 'phone', argument: phone},
            {argumentName: 'user_id', argument: user_id},
        ])
        let existingData = undefined
        if(checkRes.succeeded) {
            existingData = await this.repository.usedAsPromoCode(id, user_id, email, phone)
        } else {
            existingData = await this.repository.findById(id)

        }

        const checkResult = Guard.againstNullOrUndefined(existingData, 'existingData')

        if(!checkResult.succeeded) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Промокод не найден'
            }))
        }

        return existingData as PromoCode|boolean;
    }
}
