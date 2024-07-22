import { discounts as PersistenceData } from "@prisma/client";
import { Discount } from "../domain/discount/discount";


export class DiscountMap {
    public static toDomain(raw: PersistenceData): Discount | null {
        const result = new Discount({
            productId: raw.product_id,
            activated: raw.activated,
            percentage: raw.percentage,
            endDate: raw.end_date,
            startDate: raw.start_date
        }, raw.id)
        if(!result) return null
        return result
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