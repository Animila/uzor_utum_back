import {ICartItemRepository} from "../../repositories/ICartItemRepository";
import {ItemCartMap} from "../../mappers/ItemCartMap";
import {CartItem} from "../../domain/cart/cartItem";

interface GetIdCartInput {
    id: string
}

export class GetByIdItemCart {
    private repository: ICartItemRepository;

    constructor(repository: ICartItemRepository) {
        this.repository = repository;
    }

    async execute(input: GetIdCartInput): Promise<CartItem> {
        const {id} = input;

        const existingData = await this.repository.find(undefined, id)
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Пункт корзины не найден'
            }))

        console.log(existingData)

        return existingData as CartItem;

    }
}