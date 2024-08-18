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
            probIds, decorationIds, sizeIds, sortBy, order, categoryId, materialId, search, minPrice, maxPrice, sex, limit, offset } = input;
        const existingData = await this.productRepository.findAll(categoryId, materialId, probIds, decorationIds, sizeIds, sortBy, order, search, minPrice, maxPrice, sex, limit, offset )
        const users = existingData.map(item => {
            return ProductMap.toPersistence(item)
        })
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Продукт не найден'
            }))
        const getFiles = new GetAllFile(this.fileRepo)
        users.map(async (item) => {
            item.images = await getFiles.execute({entity_id: item.id, entity_type: 'product'})
        })
        console.log(users)
        return users;

    }
}
