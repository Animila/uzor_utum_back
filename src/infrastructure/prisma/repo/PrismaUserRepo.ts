import {IUserRepository} from "../../../repositories/IUserRepository";
import {User} from "../../../domain/user/user";
import {PrismaClient, Roles} from "@prisma/client";
import {UserMap} from "../../../mappers/UserMap";

export class PrismaUserRepo implements IUserRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<User[]> {
        const users_data = await this.prisma.users.findMany();
        return users_data.map(item => UserMap.toDomain(item)).filter((user): user is User => user !== null);
    }

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
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role: data.role as Roles,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    accepted_at: data.accepted_at

                },
                update: {
                    id: data.id,
                    email: data.email,
                    phone: data.phone,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role: data.role as Roles,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    accepted_at: data.accepted_at

                },
            })

            if(!newUser) return null

            console.log(newUser)

            return UserMap.toDomain(newUser)
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 409,
                message: 'Такой пользователь уже существует'
            }));

        }

    }

    async delete(id: string): Promise<boolean> {
        console.log(id)
        try {
            await this.prisma.users.delete({
                where: {
                    id: id
                }
            })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой пользователь не найден'
            }));

        }
    }

}