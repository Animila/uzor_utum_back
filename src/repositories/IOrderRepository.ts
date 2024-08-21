import { Order } from "../domain/order/order";

export interface IOrderRepository {
    save(data: Order): Promise<Order | null>;
    findAll(limit: number, offset: number, token?: string, user_id?: string): Promise<{data: Order[], count: number}>;
    findById(id: string): Promise<Order | null>;
    delete(id: string): Promise<boolean>;
}
