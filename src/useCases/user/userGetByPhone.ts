import {IUserRepository} from "../../repositories/IUserRepository";
import {User} from "../../domain/user/user";
import {Role, Roles} from "../../domain/user/valueObjects/role";
import {Email} from "../../domain/user/valueObjects/email";
import {Phone} from "../../domain/user/valueObjects/phone";
import {Guard} from "../../domain/guard";

interface GetUserPhoneInput {
    phone: string
}

export class GetUserByPhone {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: GetUserPhoneInput): Promise<User> {
        const { phone} = input
        const errors: Array<{type: string, message: string}> = []

        const phoneOrError = Phone.create(phone)

        phoneOrError instanceof Error && errors.push({type: 'phone', message: phoneOrError.message})
        if(errors.length !== 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))
        const successPhone = phoneOrError as Phone
        const existingUser = await this.userRepository.findByPhone(successPhone.getFullPhone())

        if(!existingUser)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Пользователь не найден'
            }))

        return existingUser;

    }
}