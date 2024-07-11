import {users as PersistenceUser} from "@prisma/client";
import {User} from "../domain/user/user";
import {Email} from "../domain/user/valueObjects/email";
import {Phone} from "../domain/user/valueObjects/phone";
import {Role, Roles} from "../domain/user/valueObjects/role";


export class UserMap {
    public static toDomain(raw: PersistenceUser): User | null {
        const emailOrError = Email.create(raw.email)
        const phoneOrError = Phone.create(raw.phone)
        const roleOrError = Role.create(Roles.user)

        if(emailOrError instanceof Error || phoneOrError instanceof Error || roleOrError instanceof Error) return null

        const user = new User({
            phone: phoneOrError,
            email: emailOrError,
            firstName: raw.first_name,
            lastName: raw.last_name,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at || undefined,
            acceptedAt: raw.accepted_at,
            role: roleOrError
        }, raw.id)

        if(!user) return null

        return user
    }

    public static toPersistence(user: User): {
        id: string
        phone: string
        email: string
        first_name: string
        last_name: string
        role: string
        accepted_at: boolean
        created_at: Date
        updated_at?: Date
    } {
        return {
            id: user.getId(),
            first_name: user.getFirstName(),
            last_name: user.getLastName(),
            email: user.getEmail().getFull(),
            phone: user.getPhone().getFullPhone(),
            role: user.getRole().getValue(),
            accepted_at: user.getAcceptedAs(),
            created_at: user.getCreatedAt(),
            updated_at: user.getUpdatedAt()
        }
    }
}