import {IDeliveryZoneRepository} from "../../repositories/IDeliveryZoneRepository";
import {DeliveryZone} from "../../domain/deliveryzone/deliveryzone";

interface GetByIdDeliveryZoneInput {
    id: string
}

export class GetByIdDeliveryZone {
    private DeliveryZoneRepository: IDeliveryZoneRepository

    constructor(DeliveryZoneRepository: IDeliveryZoneRepository) {
        this.DeliveryZoneRepository = DeliveryZoneRepository;
    }

    async execute(input: GetByIdDeliveryZoneInput): Promise<DeliveryZone> {
        const { id } = input
        const existingDeliveryZones = await this.DeliveryZoneRepository.findById(id)
        if(!existingDeliveryZones) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Зона не найдена'
            }))
        }
        return existingDeliveryZones
    }
}
