import { User } from "../domain/user/user";

export interface IUserRepository {
    save(data: User): Promise<User | null>
    findAll(limit: number, offset: number, search?: string): Promise<{data: User[], count: number}>
    findByEmail(email: string): Promise<User | null>
    findById(uuid: string): Promise<User | null>
    findByPhone(phone: string): Promise<User | null>
    delete(id: string): Promise<boolean>
}
