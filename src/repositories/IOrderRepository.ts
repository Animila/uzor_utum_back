import { Order } from "../domain/order/order";

export interface IOrderRepository {
    save(data: Order): Promise<Order | null>;
    findAll(limit: number, offset: number, token?: string, user_id?: string, shop_id?: string, status?: string[], send_type_id?: string, search?: string, created_at?: Date, updated_at?: Date): Promise<{data: Order[], count: number}>;
    findById(id: string): Promise<Order | null>;
    delete(id: string): Promise<boolean>;
    getStats(): Promise<{ count: number, items: any, sales: any }>
}
