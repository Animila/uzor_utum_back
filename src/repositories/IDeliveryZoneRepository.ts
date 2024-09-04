import {DeliveryZone} from "../domain/deliveryzone/deliveryzone";

export interface IDeliveryZoneRepository {
    save(data: DeliveryZone): Promise<DeliveryZone | null>;
    findAll(limit: number, offset: number ): Promise<{data: DeliveryZone[], count: number}>;
    findById(id: string): Promise<DeliveryZone | null>;
    delete(id: string): Promise<boolean>;
}
