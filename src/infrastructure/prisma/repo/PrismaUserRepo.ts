import {IUserRepository} from "../../../repositories/IUserRepository";
import {User} from "../../../domain/user/user";
import {PrismaClient, Roles} from "@prisma/client";
import {UserMap} from "../../../mappers/UserMap";
import {Role} from "../../../domain/user/valueObjects/role";

export class PrismaUserRepo implements IUserRepository {
    private prisma = new PrismaClient();

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.users.findUnique({
            where: {
                email: email
            }
        })
        if(!user) return null
        return UserMap.toDomain(user)
    }

    async findById(uuid: string): Promise<User | null> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: uuid
            }
        })
        if(!user) return null
        return UserMap.toDomain(user)
    }

    async findByPhone(phone: string): Promise<User | null> {
        try {
            const user = await this.prisma.users.findUnique({
                where: {
                    phone: phone
                }
            })
            if (!user) return null
            return UserMap.toDomain(user)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Проблемы с базой данных'
            }));
        }
    }

    async save(user: User): Promise<User | null> {
        try {
            const data = UserMap.toPersistence(user)

            const newUser = await this.prisma.users.upsert({
                where: { id: data.id },
                create: {
                    id: data.id,
                    email: data.email,
                    phone: data.phone,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role: data.role as Roles,
                    created_at: data.createdAt,
                    updated_at: data.updatedAt,
                    accepted_at: data.acceptedAt

                },
                update: {
                    id: data.id,
                    email: data.email,
                    phone: data.phone,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role: data.role as Roles,
                    created_at: data.createdAt,
                    updated_at: data.updatedAt,
                    accepted_at: data.acceptedAt

                },
            })

            if(!newUser) return null

            return UserMap.toDomain(newUser)
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 409,
                message: 'Такой пользователь уже существует'
            }));

        }

    }

}