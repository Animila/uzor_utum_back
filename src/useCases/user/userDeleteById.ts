import {IUserRepository} from "../../repositories/IUserRepository";
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
                message: [
                    {
                        type: 'user_id',
                        message: 'Нет user_id'
                    }
                ]
            }))
        return await this.userRepository.delete(user_id)
    }
}
