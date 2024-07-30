import {IProductRepository} from "../../repositories/IProductRepository";
import {Product} from "../../domain/products/product";
import {Sex} from "../../domain/products/valueObjects/sex";

interface CreateProductInput {
    title: string;
    article: string;
    price: number;
    path_images: string[];
    sex: string;
    description: string;
    details: string;
    delivery: string;
    prob_ids: string[];
    decoration_ids: string[];
    size_ids: string[];
    available: number;
    category_id: string;
    material_id: string;
}

export class CreateProduct {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: CreateProductInput): Promise<Product> {
        const {
            title,
            article,
            price,
            path_images,
            sex,
            description,
            details,
            delivery,
            size_ids,
            prob_ids,
            decoration_ids,
            available,
            category_id,
            material_id
        } = input;

        const sexOrError = Sex.create(sex);
        const errors: Array<{type: string, message: string}> = []
        sexOrError instanceof Error && errors.push({type: 'sex', message: sexOrError.message})
        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))

        const product = new Product({
            title: title,
            article: article,
            price: price,
            pathImages: path_images,
            sex: sexOrError as Sex,
            description: description,
            details: details,
            delivery: delivery,
            decorationIds: decoration_ids,
            sizeIds: size_ids,
            probIds: prob_ids,
            available: available,
            categoryId: category_id,
            materialId: material_id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await this.productRepository.save(product);
        return product;

    }
}