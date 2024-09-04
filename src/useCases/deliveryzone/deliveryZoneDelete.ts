import {IDeliveryZoneRepository} from "../../repositories/IDeliveryZoneRepository";
import {Guard} from "../../domain/guard";

interface DeleteDeliveryZoneInput {
    id: string
}

export class DeleteDeliveryZone {
    private DeliveryZoneRepository: IDeliveryZoneRepository

    constructor(DeliveryZoneRepository: IDeliveryZoneRepository) {
        this.DeliveryZoneRepository = DeliveryZoneRepository;
    }

    async execute(input: DeleteDeliveryZoneInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'id',
                        message: 'Нет id'
                    }
                ]
            }))
        return await this.DeliveryZoneRepository.delete(id)

    }
}

