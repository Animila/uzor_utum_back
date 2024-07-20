import {Guard} from "../../domain/guard";
import {IProductRepository} from "../../repositories/IProductRepository";

interface IDeleteProductInput {
    id: string
}

export class DeleteProduct {
    private productRepository: IProductRepository

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: IDeleteProductInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'id',
                        message: 'Нет id'
                    }
                ]
            }))
        return await this.productRepository.delete(id)

    }
}