import {IUserRepository} from "../../../repositories/IUserRepository";
import {User} from "../../../domain/user/user";
import {PrismaClient, Roles} from "@prisma/client";
import {UserMap} from "../../../mappers/UserMap";

export class PrismaUserRepo implements IUserRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<User[]> {
        try {
            const users_data = await this.prisma.users.findMany();
            return users_data.map(item => UserMap.toDomain(item)).filter((user): user is User => user !== null);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.prisma.users.findUnique({where: {email: email}})
            if (!user) return null
            return UserMap.toDomain(user)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(uuid: string): Promise<User | null> {
        try {
            const user = await this.prisma.users.findUnique({where: {id: uuid}})
            if (!user) return null
            return UserMap.toDomain(user)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findByPhone(phone: string): Promise<User | null> {
        try {
            const user = await this.prisma.users.findUnique({ where: { phone: phone } })
            if (!user) return null
            return UserMap.toDomain(user)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Проблемы с базой данных'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: User): Promise<User | null> {
        try {
            const dataPer = UserMap.toPersistence(data)
            const newUser = await this.prisma.users.upsert({
                where: { id: dataPer.id },
                create: {
                    id: dataPer.id,
                    email: dataPer.email,
                    phone: dataPer.phone,
                    first_name: dataPer.first_name,
                    last_name: dataPer.last_name,
                    role: dataPer.role as Roles,
                    created_at: dataPer.created_at,
                    updated_at: dataPer.updated_at,
                    accepted_at: dataPer.accepted_at

                },
                update: {
                    id: dataPer.id,
                    email: dataPer.email,
                    phone: dataPer.phone,
                    first_name: dataPer.first_name,
                    last_name: dataPer.last_name,
                    role: dataPer.role as Roles,
                    created_at: dataPer.created_at,
                    updated_at: dataPer.updated_at,
                    accepted_at: dataPer.accepted_at
                }
            })
            if(!newUser) return null
            return UserMap.toDomain(newUser)
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 409,
                message: 'Такой пользователь уже существует'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.users.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой пользователь не найден'
            }))
        } finally {
            await this.prisma.$disconnect();
        }
    }
}