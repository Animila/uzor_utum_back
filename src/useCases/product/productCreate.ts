import {IProductRepository} from "../../repositories/IProductRepository";
import {Product} from "../../domain/products/product";
import {Sex} from "../../domain/products/valueObjects/sex";
import {Attributes} from "../../domain/products/valueObjects/attributes";

interface CreateProductInput {
    title: string;
    article: string;
    price: number;
    path_images: string[];
    sex: string;
    description: string;
    details: string;
    delivery: string;
    attributes: Record<string, any>;
    available: number;
    categoryId: string;
    materialId: string;
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
            attributes,
            available,
            categoryId,
            materialId
        } = input;

        const sexOrError = Sex.create(sex);
        const attributesOrError = Attributes.create(attributes);

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
            path_images: path_images,
            sex: sexOrError as Sex,
            description: description,
            details: details,
            delivery: delivery,
            attributes: attributesOrError ,
            available: available,
            categoryId: categoryId,
            materialId: materialId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await this.productRepository.save(product);
        return product;

    }
}