import {IReceiverRepository} from "../../../repositories/IReceiverRepository";
import {PrismaClient} from "@prisma/client";
import {Receiver} from "../../../domain/order/receiver";
import {ReceiverMap} from "../../../mappers/ReceiverMap";

export class PrismaReceiverRepo implements IReceiverRepository {
    private prisma = new PrismaClient();

    async findAll(token?: string): Promise<Receiver[]> {
        try {
            const data = await this.prisma.receivers.findMany({
                where: {
                    token
                }
            })
            return data.map(receiver => ReceiverMap.toDomain(receiver)).filter(receiver => receiver != null)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Receiver | null> {
        try {
            const data = await this.prisma.receivers.findUnique({where: {id: id}})
            if (!data) return null
            return ReceiverMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Receiver): Promise<Receiver | null> {
        try {
            const dataPer = ReceiverMap.toPersistence(data)
            const newUser = await this.prisma.receivers.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    token: dataPer.token,
                    phone: dataPer.phone,
                    full_name: dataPer.full_name
                },
                update: {
                    id: dataPer.id,
                    token: dataPer.token,
                    phone: dataPer.phone,
                    full_name: dataPer.full_name
                }
            })
            if(!newUser) return null
            return ReceiverMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.receivers.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой получатель не найден'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }
}