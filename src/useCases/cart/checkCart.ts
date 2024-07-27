import {ICartRepository} from "../../repositories/ICartRepository";
import {Cart} from "../../domain/cart/cart";

interface CheckCartInput {
    user_id: string
    token: string
}

export class CheckCart {
    private repository: ICartRepository;

    constructor(repository: ICartRepository) {
        this.repository = repository;
    }

    async execute(input: CheckCartInput): Promise<Cart> {
        try {
            const { user_id, token } = input;

            const existingData = await this.repository.find(token, user_id);
            if(!existingData)
                throw new Error(JSON.stringify({
                    status: 404,
                    message: 'Корзина не найдена'
                }))
            return existingData;
        } catch (error: any) {
            console.log(error);
            return error
        }


    }
}