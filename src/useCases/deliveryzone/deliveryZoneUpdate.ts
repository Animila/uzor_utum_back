import {IDeliveryZoneRepository} from "../../repositories/IDeliveryZoneRepository";
import {DeliveryZone} from "../../domain/deliveryzone/deliveryzone";

interface UpdateDeliveryZoneInput {
    id: string,
    title: string
    description: string
    polygon: JSON
    price: number
}

export class UpdateDeliveryZone {
    private DeliveryZoneRepository: IDeliveryZoneRepository

    constructor(DeliveryZoneRepository: IDeliveryZoneRepository) {
        this.DeliveryZoneRepository = DeliveryZoneRepository;
    }

    async execute(input: UpdateDeliveryZoneInput): Promise<DeliveryZone> {
        const { id, title, description, polygon, price } = input
        const existingDeliveryZones = await this.DeliveryZoneRepository.findById(id)
        if(!existingDeliveryZones) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Зона не найдена'
            }))
        }

        const newDeliveryZone = new DeliveryZone({
            title: title || existingDeliveryZones.getTitle(),
            description: description || existingDeliveryZones.getDescription(),
            price: price || existingDeliveryZones.getPrice(),
            polygon: polygon || existingDeliveryZones.getPolygon(),
        }, existingDeliveryZones.getId())

        const savedDeliveryZone = await this.DeliveryZoneRepository.save(newDeliveryZone)

        if(!savedDeliveryZone) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedDeliveryZone
    }
}
