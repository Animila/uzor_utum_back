import {IUserRepository} from "../../repositories/IUserRepository";
import {User} from "../../domain/user/user";
import {Role, Roles} from "../../domain/user/valueObjects/role";
import {Email} from "../../domain/user/valueObjects/email";
import {Phone} from "../../domain/user/valueObjects/phone";
import {Guard} from "../../domain/guard";
import {UserMap} from "../../mappers/UserMap";


export class GetUserAll {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(): Promise<{
        id: string,
        phone: string,
        email: string,
        first_name: string,
        last_name: string,
        role: string,
        accepted_at: boolean,
        created_at: Date,
        updated_at?: Date
    }[]> {
        const existingUser = await this.userRepository.findAll()
        const users = existingUser.map(user => {
            return UserMap.toPersistence(user)
        })
        if(!existingUser)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Пользователь не найден'
            }))
        return users;

    }
}