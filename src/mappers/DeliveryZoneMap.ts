// @ts-ignore
import { delivery_zones as PersistenceData, JsonValue } from "@prisma/client";
import {DeliveryZone} from "../domain/deliveryzone/deliveryzone";


export class DeliveryZoneMap {
    public static toDomain(raw: PersistenceData): DeliveryZone | null {
        const result = new DeliveryZone({
            title: raw.title,
            description: raw.description,
            polygon: raw.polygon as JsonValue,
            price: raw.price
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: DeliveryZone): {
        id: string,
        title: string,
        description: string,
        polygon: JSON
        price: number
    } {
        return {
            id: data.getId(),
            title: data.getTitle(),
            description: data.getDescription(),
            polygon: data.getPolygon(),
            price: data.getPrice(),
        }
    }
}
