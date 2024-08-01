import {ICartItemRepository} from "../../repositories/ICartItemRepository";
import {ItemCartMap} from "../../mappers/ItemCartMap";
import {CartItem} from "../../domain/cart/cartItem";

interface deleteCartInput {
    id: string
}

export class DeleteItemCart {
    private repository: ICartItemRepository;

    constructor(repository: ICartItemRepository) {
        this.repository = repository;
    }

    async execute(input: deleteCartInput): Promise<CartItem> {
        const {id} = input;

        const existingData = await this.repository.delete(id)
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Позиция в корзине не найдена'
            }))
        return existingData;
    }
}