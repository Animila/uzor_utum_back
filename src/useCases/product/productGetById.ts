import {IProductRepository} from "../../repositories/IProductRepository";
import {Product} from "../../domain/products/product";
import {GetAllFile} from "../file/fileGetAll";
import {IFileRepo} from "../../repositories/IFileRepository";

interface GetByIdProductsInput {
    id: string,
}

export class GetByIdProducts {
    private productRepository: IProductRepository;
    private fileRepo: IFileRepo

    constructor(productRepository: IProductRepository, fileRepo: IFileRepo) {
        this.productRepository = productRepository;
        this.fileRepo = fileRepo;
    }

    async execute(input: GetByIdProductsInput): Promise<Product> {
        const { id} = input;
        const existingData = await this.productRepository.findById(id)
        if(!existingData)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Продукт не найден'
            }))
        const getFiles = new GetAllFile(this.fileRepo)
        const data = await getFiles.execute({limit: 10, offset: 0, entity_id: existingData.getId(), entity_type: 'product'})
        existingData.props.images = data.data
        return existingData;

    }
}
