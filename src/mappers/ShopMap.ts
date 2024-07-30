import { shops as PersistenceData } from "@prisma/client";
import { Shop } from "../domain/shop/shop";
import {Phones} from "../domain/shop/valueObjects/phones";
import {ITimes, Times} from "../domain/shop/valueObjects/times";
import {Email} from "../domain/shop/valueObjects/email";


export class ShopMap {
    public static toDomain(raw: PersistenceData): Shop | null {
        const phonesOrError = Phones.create(raw.phone)
        const emailOrError = Email.create(raw.email)
        const attributes = Times.create(raw.time as ITimes);
        if(phonesOrError instanceof Error || emailOrError instanceof Error) return null

        const result = new Shop({
            title: raw.title,
            address: raw.address,
            latitude: raw.latitude,
            longitude: raw.longitude,
            phones: phonesOrError,
            times: attributes,
            email: emailOrError
        }, raw.id)
        if(!result) return null
        return result
    }

    public static toPersistence(data: Shop): {
        id: string,
        title: string
        address: string,
        latitude: string,
        longitude: string,
        email: string,
        phones: string[],
        times: JSON
    } {
        return {
            id: data.getId(),
            title: data.getTitle(),
            address: data.getAddress(),
            latitude: data.getLatitude(),
            longitude: data.getLongitude(),
            email: data.getEmail().getFull(),
            phones: data.getPhones().getPhones(),
            times: data.getTimes().getTimes() as JSON
        }
    }
}