import {IProductRepository} from "../../repositories/IProductRepository";
import {ProductMap} from "../../mappers/ProductMap";

interface GetAllProductsInput {
    probIds?: string[];
    decorationIds?: string[];
    sizeIds?: string[];
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
        images?: any
        sex: string,
        description: string,
        details: string,
        delivery: string,
        prob_ids: string[];
        decoration_ids: string[];
        size_ids: string[];
        discount?: any,
        available: number,
        category_id: string,
        material_id: string,
        created_at: Date,
        updated_at: Date
    }[]> {
        const {
            probIds, decorationIds, sizeIds, sortBy, order, categoryId, materialId, search, minPrice, maxPrice } = input;
        const existingData = await this.productRepository.findAll(categoryId, materialId, probIds, decorationIds, sizeIds, sortBy, order, search, minPrice, maxPrice )
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