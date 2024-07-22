import { products as PersistenceData } from "@prisma/client";
import { Product } from "../domain/products/product";
import { Sex } from "../domain/products/valueObjects/sex";
import { Attributes, IAttributes } from "../domain/products/valueObjects/attributes";

export class ProductMap {
    public static toDomain(raw: PersistenceData): Product | null {
        const sexOrError = Sex.create(raw.sex)
        const attributes = Attributes.create(raw.attributes as IAttributes);

        if(sexOrError instanceof Error) return null


        const result = new Product({
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

        if(!result) return null
        return result
    }

    public static toPersistence(data: Product): {
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
            id: data.getId(),
            title: data.getTitle(),
            article: data.getArticle(),
            price: data.getPrice(),
            path_images: data.getPathImages(),
            sex: data.getSex().getValue(),
            description: data.getDescription(),
            details: data.getDetails(),
            delivery: data.getDelivery(),
            attributes: data.getAttributes().getAttributes() as JSON,
            available: data.getAvailable(),
            categoryId: data.getCategory(),
            materialId: data.getMaterial(),
            createdAt: data.getCreatedAt(),
            updatedAt: data.getUpdatedAt(),
        }
    }
}