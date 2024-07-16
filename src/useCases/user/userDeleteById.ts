import {IUserRepository} from "../../repositories/IUserRepository";
import {User} from "../../domain/user/user";
import {Role, Roles} from "../../domain/user/valueObjects/role";
import {Email} from "../../domain/user/valueObjects/email";
import {Phone} from "../../domain/user/valueObjects/phone";
import {Guard} from "../../domain/guard";

interface DeleteUserByIdInput {
    user_id: string
}

export class DeleteUserById {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: DeleteUserByIdInput): Promise<boolean> {
        const { user_id } = input
        const check = Guard.againstNullOrUndefined(user_id, 'user_id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет user_id'
            }))
        return await this.userRepository.delete(user_id)
    }
}