import { Receiver } from "../domain/order/receiver";

export interface IReceiverRepository {
    save(data: Receiver): Promise<Receiver | null>;
    findAll(limit: number, offset: number, token?: string): Promise<{data: Receiver[], count: number}>;
    findById(id: string): Promise<Receiver | null>;
    delete(id: string): Promise<boolean>;
}
