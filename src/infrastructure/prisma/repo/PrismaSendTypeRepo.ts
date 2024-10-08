import {ISendTypeRepository} from "../../../repositories/ISendTypeRepository";
import {PrismaClient} from "@prisma/client";
import {SendType} from "../../../domain/order/sendType";
import {SendTypeMap} from "../../../mappers/SendTypeMap";

export class PrismaSendTypeRepo implements ISendTypeRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number, token?: string): Promise<{data: SendType[], count: number}> {
        try {
            const countData = await this.prisma.send_types.count()
            const data = await this.prisma.send_types.findMany({
                take: limit,
                skip: limit * offset})
            const result = data.map(sendType => SendTypeMap.toDomain(sendType)).filter(sendType => sendType != null)
            return {
                data: result,
                count: countData,
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<SendType | null> {
        try {
            const data = await this.prisma.send_types.findUnique({where: {id: id}})
            if (!data) return null
            return SendTypeMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: SendType): Promise<SendType | null> {
        try {
            const dataPer = SendTypeMap.toPersistence(data)
            const newUser = await this.prisma.send_types.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    title: dataPer.title,
                    description: dataPer.description,
                    price: dataPer.price
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                    description: dataPer.description,
                    price: dataPer.price
                }
            })
            if(!newUser) return null
            return SendTypeMap.toDomain(newUser)
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.send_types.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой тип доставки не найден'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
