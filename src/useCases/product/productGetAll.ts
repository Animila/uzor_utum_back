import {IProductRepository} from "../../repositories/IProductRepository";
import {ProductMap} from "../../mappers/ProductMap";

interface GetAllProductsInput {
    filters?: JSON;
    sortBy?: string;
    order?: "asc" | "desc";
    categoryId?: string;
    materialId?: string;
    search?: string,
    minPrice?: number,
    maxPrice?: number
}

export class GetAllProducts {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: GetAllProductsInput): Promise<{
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
        materialId: string,
        createdAt: Date,
        updatedAt: Date
    }[]> {
        const { filters, sortBy, order, categoryId, materialId, search, minPrice, maxPrice } = input;
        const existingData = await this.productRepository.findAll(categoryId, materialId, filters, sortBy, order, search, minPrice, maxPrice )
        const users = existingData.map(item => {
            return ProductMap.toPersistence(item)
        })
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Продукт не найден'
            }))
        return users;

    }
}