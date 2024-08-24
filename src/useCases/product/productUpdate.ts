import {IProductRepository} from "../../repositories/IProductRepository";
import {Product} from "../../domain/products/product";
import {Sex} from "../../domain/products/valueObjects/sex";
import {IFileRepo} from "../../repositories/IFileRepository";

interface UpdateProductInput {
    id: string,
    title?: string,
    article?: string,
    price?: number,
    description?: string,
    images?: any
    sex?: string
    details?: string
    delivery?: string
    available?: number
    categoryId?: string
    materialId?: string
    probIds: string[]
    decorationIds: string[]
    sizeIds: string[]
}

export class UpdateProduct {
    private productRepository: IProductRepository;
    private fileRepo: IFileRepo

    constructor(productRepository: IProductRepository, fileRepo: IFileRepo) {
        this.productRepository = productRepository;
        this.fileRepo = fileRepo;
    }

    async execute(input: UpdateProductInput): Promise<Product> {
        const {
            id,
            title,
            article,
            price,
            images,
            sex,
            description,
            details,
            delivery,
            available,
            categoryId,
            materialId,
            probIds,
            decorationIds,
            sizeIds
        } = input;
        const existingData = await this.productRepository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Продукт не найден'
            }))
        }

        const sexOrError = sex ? Sex.create(sex) : undefined

        if(sexOrError instanceof Error ) {
            throw new Error(JSON.stringify({
                status: 400,
                message: {
                    type: 'sex',
                    message: 'Пол неверный'
                }
            }))
        }

        const newMaterial = new Product({
            title: title || existingData.getTitle(),
            article: article || existingData.getArticle(),
            description: description || existingData.getDescription(),
            delivery: delivery || existingData.getDelivery(),
            details: details || existingData.getDetails(),
            images: images || existingData.getImages(),
            sex: sexOrError as Sex || existingData.getSex(),
            materialId: materialId || existingData.getMaterial(),
            available: available || existingData.getAvailable(),
            updatedAt: new Date(),
            createdAt: existingData.getCreatedAt(),
            categoryId: categoryId || existingData.getCategory(),
            price: price || existingData.getPrice(),
            decorationIds: decorationIds || existingData.getDecorationIds(),
            probIds: probIds || existingData.getProbIds(),
            sizeIds: sizeIds || existingData.getSizesIds()
        }, existingData.getId())

        const savedData = await this.productRepository.save(newMaterial)

        if(!savedData) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedData
    }
}
