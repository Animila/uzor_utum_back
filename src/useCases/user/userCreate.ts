import {IUserRepository} from "../../repositories/IUserRepository";
import {User} from "../../domain/user/user";
import {Role, Roles} from "../../domain/user/valueObjects/role";
import {Email} from "../../domain/user/valueObjects/email";
import {Phone} from "../../domain/user/valueObjects/phone";
import {Guard} from "../../domain/guard";

interface CreateUserInput {
    phone: string;
    email: string;
    first_name: string;
    last_name: string;
}

export class CreateUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: CreateUserInput): Promise<User> {
        const { email, first_name, last_name, phone} = input
        const emailOrError = Email.create(email)
        const phoneOrError = Phone.create(phone)
        const roleOrError = Role.create(Roles.user)

        const errors: Array<{type: string, message: string}> = []


        emailOrError instanceof Error && errors.push({type: 'email', message: emailOrError.message})
        phoneOrError instanceof Error && errors.push({type: 'phone', message: phoneOrError.message})
        roleOrError instanceof Error && errors.push({type: 'role', message: roleOrError.message})

        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))

        const user = new User({
            email: emailOrError as Email ,
            firstName: first_name,
            lastName: last_name,
            phone: phoneOrError as Phone,
            createdAt: new Date(),
            updatedAt: new Date(),
            acceptedAt: true,
            role: roleOrError as Role
        });
        await this.userRepository.save(user);
        return user;

    }
}