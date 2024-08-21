import {ICartItemRepository} from "../../repositories/ICartItemRepository";
import {CartItem} from "../../domain/cart/cartItem";

interface GetIdCartInput {
    id: string,
    limit?: number,
    offset?: number
}

export class GetByIdItemCart {
    private repository: ICartItemRepository;

    constructor(repository: ICartItemRepository) {
        this.repository = repository;
    }

    async execute(input: GetIdCartInput): Promise<CartItem> {
        const {id, limit = 10, offset = 0 } = input;

        const existingData = await this.repository.find(limit, offset, id)
        if(!existingData.data)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Пункт корзины не найден'
            }))


        return existingData.data as CartItem;

    }
}
