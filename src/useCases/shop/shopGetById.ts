import {IShopRepository} from "../../repositories/IShopRepository";
import {Shop} from "../../domain/shop/shop";

interface GetByIdShopInput {
    id: string
}

export class GetByIdShop {
    private shopRepository: IShopRepository

    constructor(shopRepository: IShopRepository) {
        this.shopRepository = shopRepository;
    }

    async execute(input: GetByIdShopInput): Promise<Shop> {
        const { id } = input
        const existingShops = await this.shopRepository.findById(id)
        if(!existingShops) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Магазин не найден'
            }))
        }
        return existingShops
    }
}