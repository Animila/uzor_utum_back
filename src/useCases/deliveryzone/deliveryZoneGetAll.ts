import {IDeliveryZoneRepository} from "../../repositories/IDeliveryZoneRepository";
import {DeliveryZoneMap} from "../../mappers/DeliveryZoneMap";

export class GetAllDeliveryZone {
    private DeliveryZoneRepository: IDeliveryZoneRepository

    constructor(DeliveryZoneRepository: IDeliveryZoneRepository) {
        this.DeliveryZoneRepository = DeliveryZoneRepository;
    }

    async execute(limit: number = 10, offset: number = 0): Promise<{
        data: {
            id: string
            title: string
            description: string
            polygon: JSON
            price: number
        }[],
        count: number
    }> {
        const existingDeliveryZones = await this.DeliveryZoneRepository.findAll(limit, offset)
        const all = existingDeliveryZones.data.map(item => {
            return DeliveryZoneMap.toPersistence(item)
        })
        if(!all) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Зоны не найдены'
            }))
        }
        return {
            data: all,
            count: existingDeliveryZones.count
        }
    }
}
