import {IShopRepository} from "../../repositories/IShopRepository";
import {Shop} from "../../domain/shop/shop";
import {ITimes, Times} from "../../domain/shop/valueObjects/times";
import {Email} from "../../domain/shop/valueObjects/email";
import {Phones} from "../../domain/shop/valueObjects/phones";

interface CreateShopInput {
    title: string
    address: string
    longitude: string
    latitude: string
    email: string
    times: JSON
    phones: string[]
}

export class CreateShop {
    private shopRepository: IShopRepository

    constructor(shopRepository: IShopRepository) {
        this.shopRepository = shopRepository;
    }

    async execute(input: CreateShopInput): Promise<Shop> {
        const {address, latitude, longitude, email, times, phones, title} = input
        console.log(times)
        const attributes = Times.create(times as ITimes);
        const emailOrError = Email.create(email)
        const phonesOrError = Phones.create(phones)

        const errors: Array<{type: string, message: string}> = []

        emailOrError instanceof Error && errors.push({type: 'email', message: emailOrError.message})
        phonesOrError instanceof Error && errors.push({type: 'phone', message: phonesOrError.message})

        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))


        const token = new Shop({
            title: title,
            address: address,
            latitude: latitude,
            longitude: longitude,
            email: emailOrError as Email,
            phones: phonesOrError as Phones,
            times: attributes
        })
        console.log(token)
        await this.shopRepository.save(token)
        return token
    }
}