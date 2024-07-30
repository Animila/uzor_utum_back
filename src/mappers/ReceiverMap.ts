import { receivers as PersistenceData } from "@prisma/client";
import { Receiver } from "../domain/order/receiver";
import {Phone} from "../domain/order/valueObjects/phone";


export class ReceiverMap {
    public static toDomain(raw: PersistenceData): Receiver | null {

        const phoneOrError = Phone.create(raw.phone)
        if(phoneOrError instanceof Error ) return null

        const result = new Receiver({
            token: raw.token,
            fullName: raw.full_name,
            phone: phoneOrError
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Receiver): {
        id: string,
        token: string
        full_name: string,
        phone: string,
    } {
        return {
            id: data.getId(),
            token: data.getToken(),
            full_name: data.getFullName(),
            phone: data.getPhone().getFullPhone(),
        }
    }
}