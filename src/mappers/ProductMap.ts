import {products as PersistenceProduct} from "@prisma/client";
import {Product} from "../domain/products/product";
import {Sex} from "../domain/products/valueObjects/sex";
import {Attributes, IAttributes} from "../domain/products/valueObjects/attributes";

export class ProductMap {
    public static toDomain(raw: PersistenceProduct): Product | null {
        const sexOrError = Sex.create(raw.sex)
        const attributes = Attributes.create(raw.attributes as IAttributes);

        if(sexOrError instanceof Error) return null


        const token = new Product({
            title: raw.title,
            sex: sexOrError as Sex,
            description: raw.description,
            details: raw.details,
            delivery: raw.delivery,
            article: raw.article,
            price: raw.price,
            pathImages: raw.path_images,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            attributes: attributes,
            available: raw.available,
            categoryId: raw.category_id,
            materialId: raw.material_id
        }, raw.id)

        if(!token) return null

        return token
    }

    public static toPersistence(product: Product): {
        id: string
        title: string
        article: string
        price: number
        path_images: string[]
        sex: string
        description: string
        details: string
        delivery: string
        attributes: JSON;
        available: number
        categoryId: string
        materialId: string
        createdAt: Date
        updatedAt: Date
    } {
        return {
            id: product.getId(),
            title: product.getTitle(),
            article: product.getArticle(),
            price: product.getPrice(),
            path_images: product.getPathImages(),
            sex: product.getSex().getValue(),
            description: product.getDescription(),
            details: product.getDetails(),
            delivery: product.getDelivery(),
            attributes: product.getAttributes().getAttributes() as JSON,
            available: product.getAvailable(),
            categoryId: product.getCategory(),
            materialId: product.getMaterial(),
            createdAt: product.getCreatedAt(),
            updatedAt: product.getUpdatedAt(),
        }
    }
}