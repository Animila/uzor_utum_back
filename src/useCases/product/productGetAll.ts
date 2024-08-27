import {IProductRepository} from "../../repositories/IProductRepository";
import {ProductMap} from "../../mappers/ProductMap";
import {GetAllFile} from "../file/fileGetAll";
import {IFileRepo} from "../../repositories/IFileRepository";

interface GetAllProductsInput {
    probIds?: string[];
    decorationIds?: string[];
    sizeIds?: string[];
    sortBy?: string;
    order?: "asc" | "desc";
    discount_at?: boolean,
    categoryId?: string;
    materialId?: string;
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sex?: string,
    limit?: number,
    offset?: number,
}

export class GetAllProducts {
    private productRepository: IProductRepository;
    private fileRepo: IFileRepo

    constructor(productRepository: IProductRepository, fileRepo: IFileRepo) {
        this.productRepository = productRepository;
        this.fileRepo = fileRepo;
    }

    async execute(input: GetAllProductsInput): Promise<{
        data: {
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
            discount_at?: boolean,
            decoration_ids: string[];
            size_ids: string[];
            discount?: any,
            available: number,
            category_id: string,
            material_id: string,
            created_at: Date,
            updated_at: Date,
            review?: any
        }[],
        count: number
    }> {
        const {
            probIds, decorationIds, sizeIds, sortBy, order, categoryId, materialId, search, minPrice, maxPrice, sex, limit= 10, offset = 0, discount_at } = input;
        const existingData = await this.productRepository.findAll(categoryId, materialId, probIds, decorationIds, discount_at, sizeIds, sortBy, order, search, minPrice, maxPrice, sex, limit, offset )
        const users = existingData.data.map(item => {
            return ProductMap.toPersistence(item)
        })
        if(!users)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Продукт не найден'
            }))
        const getFiles = new GetAllFile(this.fileRepo)
        await Promise.all(users.map(async (item) => {
            const res = await getFiles.execute({limit: 10, offset: 0, entity_id: item.id, entity_type: 'product'})
            item.images = res.data
        }))
        return {
            data: users,
            count: existingData.count
        };

    }
}
