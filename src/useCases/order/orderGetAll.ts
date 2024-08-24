import {IOrderRepository} from "../../repositories/IOrderRepository";
import {Order} from "../../domain/order/order";

interface GetAllOrderInput {
    user_id: string,
    token: string,
    offset: number,
    limit: number,
    status: string,
    shop_id: string,
    send_type_id: string
}

export class GetAllOrder {
    private productRepository: IOrderRepository;

    constructor(productRepository: IOrderRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: GetAllOrderInput): Promise<{data: Order[], count: number}> {
        const {
            token,
            user_id,
            limit = 10, offset = 0,
            shop_id,
            status,
            send_type_id
        } = input;

        const res = await this.productRepository.findAll(limit, offset, token, user_id, shop_id, status, send_type_id);
        return {
            data: res.data,
            count: res.count,
        }
    }
}
