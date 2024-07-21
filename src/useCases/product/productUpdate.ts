import {IProductRepository} from "../../repositories/IProductRepository";
import {Product} from "../../domain/products/product";
import {Sex} from "../../domain/products/valueObjects/sex";
import {Attributes} from "../../domain/products/valueObjects/attributes";

interface UpdateProductInput {
    id: string,
    title?: string,
    article?: string,
    price?: number,
    description?: string,
    path_images?: string[]
    sex?: string
    details?: string
    delivery?: string
    attributes?: JSON
    available?: number
    categoryId?: string
    materialId?: string
}

export class UpdateProduct {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: UpdateProductInput): Promise<Product> {
        const {
            id,
            title,
            article,
            price,
            path_images,
            sex,
            description,
            details,
            delivery,
            attributes,
            available,
            categoryId,
            materialId
        } = input;
        const existingData = await this.productRepository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const sexOrError = sex ? Sex.create(sex) : undefined

        if(sexOrError instanceof Error ) {
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Пол неверный'
            }))
        }

        const attribute = attributes ? Attributes.create(attributes) : undefined

        const newMaterial = new Product({
            title: title || existingData.getTitle(),
            article: article || existingData.getArticle(),
            description: description || existingData.getDescription(),
            delivery: delivery || existingData.getDelivery(),
            details: details || existingData.getDetails(),
            pathImages: path_images || existingData.getPathImages(),
            sex: sexOrError as Sex || existingData.getSex(),
            materialId: materialId || existingData.getMaterial(),
            available: available || existingData.getAvailable(),
            updatedAt: new Date(),
            createdAt: existingData.getCreatedAt(),
            categoryId: categoryId || existingData.getCategory(),
            price: price || existingData.getPrice(),
            attributes: attribute || existingData.getAttributes(),
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