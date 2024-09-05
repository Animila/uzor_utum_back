import {IUserRepository} from "../../../repositories/IUserRepository";
import {User} from "../../../domain/user/user";
import {PrismaClient, Roles} from "@prisma/client";
import {UserMap} from "../../../mappers/UserMap";

export class PrismaUserRepo implements IUserRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number, search?: string): Promise<{data: User[], count: number}> {
        try {
            const countData = await this.prisma.users.count({
                where: {
                    OR: [
                        { phone: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { last_name: { contains: search, mode: 'insensitive' } },
                        { first_name: { contains: search, mode: 'insensitive' } },
                    ]
                },
            })
            const users_data = await this.prisma.users.findMany({
                where: {
                    OR: [
                        { phone: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { last_name: { contains: search, mode: 'insensitive' } },
                        { first_name: { contains: search, mode: 'insensitive' } },
                    ]
                },
                take: limit,
                skip: limit * offset
            });
            const result = users_data.map(item => UserMap.toDomain(item)).filter((user): user is User => user !== null);
            return {
                data: result,
                count: countData
            }
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
            console.log(error)
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
                    accepted_at: dataPer.accepted_at,
                    //@ts-ignore
                    last_online_at: dataPer.last_online_at,
                    activated_at: dataPer.activated_at,
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
                    accepted_at: dataPer.accepted_at,
                    //@ts-ignore
                    last_online_at: dataPer.last_online_at,
                    activated_at: dataPer.activated_at,
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

    async getStats(): Promise<{ count_week: number }> {
        try {
            const result = await this.prisma.users.aggregate({
                _count: {
                    id: true
                },
                where: {
                    last_online_at: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Начало недели
                    }
                }
            });

            return { count_week: result._count.id };
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500, // Изменил статус на 500, так как это ошибка сервера
                message: 'Произошла ошибка при получении данных'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
