import {IShopRepository} from "../../repositories/IShopRepository";
import {ShopMap} from "../../mappers/ShopMap";

export class GetAllShop {
    private shopRepository: IShopRepository

    constructor(shopRepository: IShopRepository) {
        this.shopRepository = shopRepository;
    }

    async execute(limit: number = 10, offset: number =0): Promise<{
        data: {
            id: string
            title: string
            address: string
            latitude: string
            longitude: string
            email: string
            phones: string[]
            times: JSON
        }[],
        count: number
    }> {
        const existingShops = await this.shopRepository.findAll(limit, offset)
        const categories = existingShops.data.map(item => {
            return ShopMap.toPersistence(item)
        })
        if(!categories) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Магазины не найдены'
            }))
        }
        return {
            data: categories,
            count: existingShops.count
        }
    }
}
