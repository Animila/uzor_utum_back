import { Order } from "../domain/order/order";

export interface IOrderRepository {
    save(data: Order): Promise<Order | null>;
    findAll(token?: string, user_id?: string): Promise<Order[]>;
    findById(id: string): Promise<Order | null>;
    delete(id: string): Promise<boolean>;
}