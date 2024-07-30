import {IShopRepository} from "../../repositories/IShopRepository";
import {Shop} from "../../domain/shop/shop";
import {Phones} from "../../domain/shop/valueObjects/phones";
import {Email} from "../../domain/shop/valueObjects/email";
import {ITimes, Times} from "../../domain/shop/valueObjects/times";

interface UpdateShopInput {
    id: string,
    title: string
    address?: string
    latitude?: string
    longitude?: string
    phones?: string[]
    email?: string
    times?: JSON
}

export class UpdateShop {
    private shopRepository: IShopRepository

    constructor(shopRepository: IShopRepository) {
        this.shopRepository = shopRepository;
    }

    async execute(input: UpdateShopInput): Promise<Shop> {
        const { id, title, address, latitude, longitude, times, phones, email } = input
        const existingShops = await this.shopRepository.findById(id)
        if(!existingShops) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Магазин не найден'
            }))
        }

        const phonesOrError = phones ? Phones.create(phones) : undefined
        const emailOrError = email ? Email.create(email) : undefined
        const attributes = Times.create(times as ITimes);

        const errors: Array<{type: string, message: string}> = []

        emailOrError instanceof Error && errors.push({type: 'email', message: emailOrError.message})
        phonesOrError instanceof Error && errors.push({type: 'phone', message: phonesOrError.message})

        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))

        const newShop = new Shop({
            title: title || existingShops.getTitle(),
            address: address || existingShops.getAddress(),
            longitude: longitude || existingShops.getLongitude(),
            latitude: latitude || existingShops.getLatitude(),
            email: emailOrError as Email || existingShops.getEmail(),
            phones: phonesOrError as Phones || existingShops.getPhones(),
            times: attributes || existingShops.getTimes(),
        }, existingShops.getId())

        const savedShop = await this.shopRepository.save(newShop)

        if(!savedShop) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedShop
    }
}