import {IUserRepository} from "../../repositories/IUserRepository";
import {User} from "../../domain/user/user";
import {Role} from "../../domain/user/valueObjects/role";
import {Email} from "../../domain/user/valueObjects/email";
import {Phone} from "../../domain/user/valueObjects/phone";

interface UpdateUserInput {
    id: string
    phone?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string
}

export class UpdateUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: UpdateUserInput): Promise<User> {
        const { id, email, first_name, last_name, phone, role} = input


        const errors: Array<{type: string, message: string}> = []
        var emailOrError, phoneOrError, roleOrError = null;
        if(email) {
            emailOrError = Email.create(email)
            emailOrError instanceof Error && errors.push({type: 'email', message: emailOrError.message})
        }
        if(phone) {
            phoneOrError = Phone.create(phone)
            phoneOrError instanceof Error && errors.push({type: 'phone', message: phoneOrError.message})
        }

        if(role) {
            roleOrError = Role.create(role)
            roleOrError instanceof Error && errors.push({type: 'role', message: roleOrError.message})
        }

        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))


        const existingUser = await this.userRepository.findById(id)

        if(!existingUser)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Пользователь не найден'
            }))


        const updateUser = new User(
            {
                email: emailOrError as Email || existingUser.getEmail(),
                phone: phoneOrError as Phone || existingUser.getPhone(),
                firstName: first_name || existingUser.getFirstName(),
                lastName: last_name || existingUser.getLastName(),
                role: roleOrError as Role || existingUser.getRole(),
                createdAt: existingUser.getCreatedAt(),
                updatedAt: new Date(),
                acceptedAt: existingUser.getAcceptedAs(),
            },
            existingUser.getId()
        )



        const savedUser = await this.userRepository.save(updateUser);
        if(!savedUser) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }
        return savedUser;

    }
}
