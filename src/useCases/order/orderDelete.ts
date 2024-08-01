import {IOrderRepository} from "../../repositories/IOrderRepository";
import {Order} from "../../domain/order/order";
import {iItems, Items} from "../../domain/order/valueObjects/items";
import {Phone} from "../../domain/order/valueObjects/phone";
import {Email} from "../../domain/order/valueObjects/email";
import {OrderStatus} from "../../domain/order/valueObjects/OrderStatus";

interface DeleteOrderInput {
    id: string,
}

export class DeleteOrder {
    private productRepository: IOrderRepository;

    constructor(productRepository: IOrderRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: DeleteOrderInput): Promise<boolean> {
        const {id} = input;
        return await this.productRepository.delete(id);

    }
}