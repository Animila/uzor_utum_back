import {ICartRepository} from "../../repositories/ICartRepository";
import {Cart} from "../../domain/cart/cart";

interface GetIdCartInput {
    id: string
}

export class GetByIDCart {
    private repository: ICartRepository;

    constructor(repository: ICartRepository) {
        this.repository = repository;
    }

    async execute(input: GetIdCartInput): Promise<Cart> {
        try {
            const { id } = input;

            const existingData = await this.repository.find(undefined, undefined, id);
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