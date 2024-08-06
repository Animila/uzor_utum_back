import { products as PersistenceData } from "@prisma/client";
import { Product } from "../domain/products/product";
import { Sex } from "../domain/products/valueObjects/sex";

export class ProductMap {
    public static toDomain(raw: PersistenceData): Product | null {
        const sexOrError = Sex.create(raw.sex)

        if(sexOrError instanceof Error) return null


        const result = new Product({
            title: raw.title,
            sex: sexOrError as Sex,
            description: raw.description,
            details: raw.details,
            delivery: raw.delivery,
            article: raw.article,
            price: raw.price,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            probIds: raw.prob_ids,
            sizeIds: raw.size_ids,
            decorationIds: raw.decoration_ids,
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
        sex: string
        description: string
        details: string
        delivery: string
        prob_ids: string[]
        size_ids: string[]
        decoration_ids: string[]
        available: number
        category_id: string
        material_id: string
        discount?: any
        images?: any
        created_at: Date
        updated_at: Date
    } {
        return {
            id: data.getId(),
            title: data.getTitle(),
            article: data.getArticle(),
            price: data.getPrice(),
            images: data.getImages(),
            sex: data.getSex().getValue(),
            description: data.getDescription(),
            details: data.getDetails(),
            delivery: data.getDelivery(),
            decoration_ids: data.getDecorationIds(),
            prob_ids: data.getProbIds(),
            size_ids: data.getSizesIds(),
            available: data.getAvailable(),
            category_id: data.getCategory(),
            material_id: data.getMaterial(),
            created_at: data.getCreatedAt(),
            updated_at: data.getUpdatedAt(),
        }
    }
}