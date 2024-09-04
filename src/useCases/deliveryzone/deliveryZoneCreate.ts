import {IDeliveryZoneRepository} from "../../repositories/IDeliveryZoneRepository";
import {DeliveryZone} from "../../domain/deliveryzone/deliveryzone";

interface CreateDeliveryZoneInput {
    title: string
    description: string
    polygon: JSON
    price: number
}

export class CreateDeliveryZone {
    private DeliveryZoneRepository: IDeliveryZoneRepository

    constructor(DeliveryZoneRepository: IDeliveryZoneRepository) {
        this.DeliveryZoneRepository = DeliveryZoneRepository;
    }

    async execute(input: CreateDeliveryZoneInput): Promise<DeliveryZone> {
        const {title, description, polygon, price} = input

        const newItem = new DeliveryZone({
            title: title,
            price: price,
            description: description,
            polygon: polygon,
        })
        await this.DeliveryZoneRepository.save(newItem)
        return newItem
    }
}
