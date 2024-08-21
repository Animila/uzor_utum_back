import {ICartItemRepository} from "../../repositories/ICartItemRepository";
import {CartItem} from "../../domain/cart/cartItem";

interface GetItemsCartInput {
    cart_id: string
    limit: number,
    offset: number
}

export class GetItemsCart {
    private repository: ICartItemRepository;

    constructor(repository: ICartItemRepository) {
        this.repository = repository;
    }

    async execute(input: GetItemsCartInput): Promise<{
        data: CartItem[],
        count: number
    }> {
        const {cart_id, limit = 10, offset = 0} = input;

        const existingData = await this.repository.find(limit, offset, cart_id)
        if(!existingData.data)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Скидка не найдена'
            }))

        return {
            data: existingData.data as CartItem[],
            count: existingData.count,
        };

    }
}
