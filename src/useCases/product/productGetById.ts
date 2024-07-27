import {IProductRepository} from "../../repositories/IProductRepository";
import {ProductMap} from "../../mappers/ProductMap";
import {Product} from "../../domain/products/product";

interface GetByIdProductsInput {
    id: string;
}

export class GetByIdProducts {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: GetByIdProductsInput): Promise<Product> {
        const { id } = input;
        const existingData = await this.productRepository.findById(id)
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Продукт не найден'
            }))
        return existingData;

    }
}