import {IOrderRepository} from "../../repositories/IOrderRepository";
import {Order} from "../../domain/order/order";
import {iItems, Items} from "../../domain/order/valueObjects/items";
import {Phone} from "../../domain/order/valueObjects/phone";
import {Email} from "../../domain/order/valueObjects/email";
import {OrderStatus} from "../../domain/order/valueObjects/OrderStatus";

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