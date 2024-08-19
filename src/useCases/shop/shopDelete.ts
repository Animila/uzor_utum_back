import {IShopRepository} from "../../repositories/IShopRepository";
import {Guard} from "../../domain/guard";

interface DeleteShopInput {
    id: string
}

export class DeleteShop {
    private shopRepository: IShopRepository

    constructor(shopRepository: IShopRepository) {
        this.shopRepository = shopRepository;
    }

    async execute(input: DeleteShopInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'id',
                        message: 'Нет id'
                    }
                ]
            }))
        return await this.shopRepository.delete(id)

    }
}

