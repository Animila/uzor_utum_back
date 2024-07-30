import { Receiver } from "../domain/order/receiver";

export interface IReceiverRepository {
    save(data: Receiver): Promise<Receiver | null>;
    findAll(token?: string): Promise<Receiver[]>;
    findById(id: string): Promise<Receiver | null>;
    delete(id: string): Promise<boolean>;
}