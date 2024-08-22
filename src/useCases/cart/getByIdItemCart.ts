import {ICartItemRepository} from "../../repositories/ICartItemRepository";
import {CartItem} from "../../domain/cart/cartItem";

interface GetIdCartInput {
    id: string,
    limit?: number,
    offset?: number,
    cart_id?: string
}

export class GetByIdItemCart {
    private repository: ICartItemRepository;

    constructor(repository: ICartItemRepository) {
        this.repository = repository;
    }

    async execute(input: GetIdCartInput): Promise<CartItem> {
        const {cart_id, id, limit = 10, offset = 0 } = input;
        console.log(id)

        const existingData = await this.repository.find(limit, offset, cart_id, id)
        console.log(existingData)
        if(!existingData.data)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Пункт корзины не найден'
            }))


        return existingData.data as CartItem;

    }
}
