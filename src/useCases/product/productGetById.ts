import {IProductRepository} from "../../repositories/IProductRepository";
import {ProductMap} from "../../mappers/ProductMap";

interface GetByIdProductsInput {
    id: string;
}

export class GetByIdProducts {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: GetByIdProductsInput): Promise<{
        id: string,
        title: string,
        article: string,
        price: number,
        path_images: string[],
        sex: string,
        description: string,
        details: string,
        delivery: string,
        attributes: JSON,
        available: number,
        categoryId: string,
        discount?: any,
        materialId: string,
        createdAt: Date,
        updatedAt: Date
    }> {
        const { id } = input;
        const existingData = await this.productRepository.findById(id)
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Продукт не найден'
            }))
        return ProductMap.toPersistence(existingData);

    }
}