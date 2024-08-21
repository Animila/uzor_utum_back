import {IOrderRepository} from "../../repositories/IOrderRepository";
import {Order} from "../../domain/order/order";

interface GetByIdOrderInput {
    id: string,
}

export class GetByIdOrder {
    private productRepository: IOrderRepository;

    constructor(productRepository: IOrderRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: GetByIdOrderInput): Promise<Order> {
        const {id} = input;
        const existingData = await this.productRepository.findById(id);
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Заказ не найден'
            }))
        return existingData

    }
}
