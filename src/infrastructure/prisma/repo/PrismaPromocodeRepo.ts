import {IPromocodeRepository} from "../../../repositories/IPromocodeRepository";
import {PromoCode} from "../../../domain/promocode/promocode";
import {PrismaClient} from "@prisma/client";
import {PromoCodeMap} from "../../../mappers/PromoCodeMap";

export class PrismaPromoCodeRepo implements IPromocodeRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number ): Promise<{data: PromoCode[], count: number}> {
        try {
            const countData = await this.prisma.promocodes.count()
            const data = await this.prisma.promocodes.findMany({
                take: limit,
                skip: limit * offset})
            const result = data.map(itemNull => PromoCodeMap.toDomain(itemNull)).filter(item => item != null)
            return {
                data: result,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findByCode(code: string): Promise<PromoCode | null> {
        try {
            const data = await this.prisma.promocodes.findUnique({
                where: {
                    code: code,
                    valid_to: {gte: new Date()},
                    active: true
                }
            })
            if (!data) return null;
            return PromoCodeMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<PromoCode | null> {
        try {
            const data = await this.prisma.promocodes.findUnique({where: {id: id}})
            if (!data) return null;
            return PromoCodeMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async usedAsPromoCode(id: string, user_id?: string, email?: string, phone?: string): Promise<boolean|PromoCode> {
        try {
            const data = await this.prisma.promocodes.findFirst({
                where: {
                    id: id,
                    orders: {
                        some: {
                            OR: [
                                { user_id: user_id }, // Проверяем, был ли использован пользователем
                                { email: email },     // Проверяем, был ли использован с указанным email
                                { phone: phone }      // Проверяем, был ли использован с указанным телефоном
                            ]
                        }
                    }
                },
                include: {
                    orders: true // Включаем информацию о связанных заказах
                }
            });
            console.log(data)
            if(!data) return false
            // Проверка, если промокод уже использовался
            const hasUsedPromo = data.orders.some(order => order.promocode_id === id);
            if (hasUsedPromo) return false

            const res =  PromoCodeMap.toDomain(data);
            return res ? res : false
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.promocodes.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой промокод не найден'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: PromoCode): Promise<PromoCode | null> {
        try{
            const dataPer = PromoCodeMap.toPersistence(data)

            const result = await this.prisma.promocodes.upsert({
                where: { id: dataPer.id },
                create: {
                    id: dataPer.id,
                    code: dataPer.code,
                    discount: dataPer.discount,
                    description: dataPer.description,
                    active: dataPer.active,
                    valid_to: dataPer.valid_to,
                    valid_from: dataPer.valid_from,
                },
                update: {
                    id: dataPer.id,
                    code: dataPer.code,
                    discount: dataPer.discount,
                    description: dataPer.description,
                    active: dataPer.active,
                    valid_to: dataPer.valid_to,
                    valid_from: dataPer.valid_from,
                }
            })
            if(!result) return null

            return PromoCodeMap.toDomain(result)
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

}
