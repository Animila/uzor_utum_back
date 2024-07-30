import { send_types as PersistenceData } from "@prisma/client";
import { SendType } from "../domain/order/sendType";


export class SendTypeMap {
    public static toDomain(raw: PersistenceData): SendType | null {
        const result = new SendType({
            title: raw.title,
            price: raw.price,
            description: raw.description
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: SendType): {
        id: string,
        title: string
        price: number,
        description: string,
    } {
        return {
            id: data.getId(),
            title: data.getTitle(),
            description: data.getDescription(),
            price: data.getPrice()
        }
    }
}