import {discounts as PersistenceDiscount} from "@prisma/client";
import {Discount} from "../domain/discount/discount";


export class DiscountMap {
    public static toDomain(raw: PersistenceDiscount): Discount | null {
        const data = new Discount({
            productId: raw.product_id,
            activated: raw.activated,
            percentage: raw.percentage,
            endDate: raw.end_date,
            startDate: raw.start_date
        }, raw.id)
        if(!data) return null
        return data
    }

    public static toPersistence(data: Discount): {
        id: string
        product_id: string
        percentage: number
        start_date: Date
        end_date: Date
        activated: boolean
    } {
        return {
            id: data.getId(),
            product_id: data.getProductId(),
            activated: data.getActivated(),
            percentage: data.getPercentage(),
            end_date: data.getEndDate(),
            start_date: data.getStartDate()
        }
    }
}