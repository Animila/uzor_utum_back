import {IUserRepository} from "../../repositories/IUserRepository";
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
        bonus?: number
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