import { SendType } from "../domain/order/sendType";

export interface ISendTypeRepository {
    save(data: SendType): Promise<SendType | null>;
    findAll(limit: number, offset: number ): Promise<{data: SendType[], count: number}>;
    findById(id: string): Promise<SendType | null>;
    delete(id: string): Promise<boolean>;
}
