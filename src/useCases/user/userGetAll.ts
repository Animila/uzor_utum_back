import {IUserRepository} from "../../repositories/IUserRepository";
import {UserMap} from "../../mappers/UserMap";

export class GetUserAll {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(limit: number = 10, offset: number = 0, search: string = ''): Promise<{data: {
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
        }[], count: number}> {
        const existingUser = await this.userRepository.findAll(limit, offset, search)
        const users = existingUser.data.map(user => {
            return UserMap.toPersistence(user)
        })
        if(!users)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Пользователь не найден'
            }))
        return {
            data: users,
            count: existingUser.count,
        };

    }
}
