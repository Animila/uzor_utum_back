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

    async execute(input: GetItemsCartInput): Promise<CartItem[]> {
        const {cart_id} = input;

        const existingData = await this.repository.find(cart_id) as CartItem[]
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Скидка не найдена'
            }))

        return existingData;

    }
}