import {IOrderRepository} from "../../repositories/IOrderRepository";

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
