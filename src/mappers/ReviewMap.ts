import {reviews as PersistenceData} from "@prisma/client";
import {Review} from "../domain/review/review";

export class ReviewMap {
    public static toDomain(raw: PersistenceData): Review | null {
        const result = new Review({
            name: raw.name,
            url: raw.url,
            rating: raw.rating,
            text: raw.text,
            createdAt: raw.created_at,
            publishedAt: raw.published_at ?? undefined,
            productId: raw.product_id,
            orderId: raw.order_id
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Review): {
        id: string,
        name: string,
        url: string,
        rating: number,
        text: string,
        created_at: Date,
        published_at?: Date,
        product_id: string,
        order_id: string
    } {
        return {
            id: data.getId(),
            name: data.getName(),
            url: data.getUrl(),
            rating: data.getRating(),
            text: data.getText(),
            created_at: data.getCreatedAt(),
            published_at: data.getPublishedAt(),
            product_id: data.getProductId(),
            order_id: data.getOrderId(),
        }
    }
}
