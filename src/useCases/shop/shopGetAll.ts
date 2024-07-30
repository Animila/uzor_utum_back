import {IShopRepository} from "../../repositories/IShopRepository";
import {ShopMap} from "../../mappers/ShopMap";

export class GetAllShop {
    private shopRepository: IShopRepository

    constructor(shopRepository: IShopRepository) {
        this.shopRepository = shopRepository;
    }

    async execute(): Promise<{
        id: string
        title: string
        address: string
        latitude: string
        longitude: string
        email: string
        phones: string[]
        times: JSON
    }[]> {
        const existingShops = await this.shopRepository.findAll()
        const categories = existingShops.map(item => {
            return ShopMap.toPersistence(item)
        })
        if(!existingShops) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Магазины не найдены'
            }))
        }
        return categories
    }
}