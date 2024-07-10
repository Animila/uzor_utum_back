import {User} from "../domain/user/user";

export interface IUserRepository {
    save(user: User): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findById(uuid: string): Promise<User | null>
    findByPhone(phone: string): Promise<User | null>
}