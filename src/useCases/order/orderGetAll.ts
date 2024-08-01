import {IOrderRepository} from "../../repositories/IOrderRepository";
import {Order} from "../../domain/order/order";
import {iItems, Items} from "../../domain/order/valueObjects/items";
import {Phone} from "../../domain/order/valueObjects/phone";
import {Email} from "../../domain/order/valueObjects/email";
import {OrderStatus} from "../../domain/order/valueObjects/OrderStatus";

interface GetAllOrderInput {
    user_id: string,
    token: string,
}

export class GetAllOrder {
    private productRepository: IOrderRepository;

    constructor(productRepository: IOrderRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: GetAllOrderInput): Promise<Order[]> {
        const {
            token,
            user_id,
        } = input;

        return await this.productRepository.findAll(token, user_id);

    }
}