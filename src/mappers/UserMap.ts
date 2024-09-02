import { users as PersistenceData } from "@prisma/client";
import { User } from "../domain/user/user";
import { Email } from "../domain/user/valueObjects/email";
import { Phone } from "../domain/user/valueObjects/phone";
import { Role } from "../domain/user/valueObjects/role";


export class UserMap {
    public static toDomain(raw: PersistenceData): User | null {
        const emailOrError = Email.create(raw.email)
        const phoneOrError = Phone.create(raw.phone)
        const roleOrError = Role.create(raw.role)

        if(emailOrError instanceof Error || phoneOrError instanceof Error || roleOrError instanceof Error) return null
        const result = new User({
            phone: phoneOrError,
            email: emailOrError,
            firstName: raw.first_name,
            lastName: raw.last_name,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at || undefined,
            acceptedAt: raw.accepted_at,
            //@ts-ignore
            activatedAt: raw.activated_at,
            //@ts-ignore
            lastOnlineAt: raw.last_online_at,
            role: roleOrError
        }, raw.id)

        if(!result) return null
        return result
    }

    public static toPersistence(data: User): {
        id: string
        phone: string
        email: string
        first_name: string
        last_name: string
        role: string
        accepted_at: boolean
        bonus?: number
        last_online_at: Date,
        activated_at: boolean
        created_at: Date
        updated_at?: Date
    } {
        return {
            id: data.getId(),
            first_name: data.getFirstName(),
            last_name: data.getLastName(),
            email: data.getEmail().getFull(),
            phone: data.getPhone().getFullPhone(),
            role: data.getRole().getValue(),
            accepted_at: data.getAcceptedAs(),
            created_at: data.getCreatedAt(),
            updated_at: data.getUpdatedAt(),
            activated_at: data.getActivatedAs(),
            last_online_at: data.getLastOnlineAt()
        }
    }
}
