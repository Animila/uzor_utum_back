import { SendType } from "../domain/order/sendType";

export interface ISendTypeRepository {
    save(data: SendType): Promise<SendType | null>;
    findAll(): Promise<SendType[]>;
    findById(id: string): Promise<SendType | null>;
    delete(id: string): Promise<boolean>;
}