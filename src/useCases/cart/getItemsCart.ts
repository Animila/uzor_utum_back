import {ICartItemRepository} from "../../repositories/ICartItemRepository";
import {ItemCartMap} from "../../mappers/ItemCartMap";
import {CartItem} from "../../domain/cart/cartItem";

interface GetItemsCartInput {
    cart_id: string
}

export class GetItemsCart {
    private repository: ICartItemRepository;

    constructor(repository: ICartItemRepository) {
        this.repository = repository;
    }

    async execute(input: GetItemsCartInput): Promise<{
        id: string,
        product_id: string,
        cart_id: string,
        count: number,
        updated_at: Date,
        created_at: Date
    }[]> {
        const {cart_id} = input;

        const existingData = await this.repository.find(cart_id) as CartItem[]
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Скидка не найдена'
            }))

        return existingData.map(item => ItemCartMap.toPersistence(item));

    }
}