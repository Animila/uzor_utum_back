// @ts-ignore
import {JsonValue, PrismaClient} from "@prisma/client";
import {IDeliveryZoneRepository} from "../../../repositories/IDeliveryZoneRepository";
import {DeliveryZone} from "../../../domain/deliveryzone/deliveryzone";
import {DeliveryZoneMap} from "../../../mappers/DeliveryZoneMap";

export class PrismaDeliveryZoneRepo implements IDeliveryZoneRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number): Promise<{data: DeliveryZone[], count: number}> {
        try {
            const countData = await this.prisma.delivery_zones.count()
            const data = await this.prisma.delivery_zones.findMany({
                take: limit,
                skip: limit * offset
            })
            const result = data.map(result => DeliveryZoneMap.toDomain(result)).filter(material => material != null)
            return {
                data: result,
                count: countData,
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<DeliveryZone | null> {
        try {
            const data = await this.prisma.delivery_zones.findUnique({where: {id: id}})
            if (!data) return null
            return DeliveryZoneMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: DeliveryZone): Promise<DeliveryZone | null> {
        try {
            const dataPer = DeliveryZoneMap.toPersistence(data)
            const newUser = await this.prisma.delivery_zones.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    title: dataPer.title,
                    polygon: dataPer.polygon as JsonValue,
                    price: dataPer.price,
                    description: dataPer.description
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                }
            })
            if(!newUser) return null
            return DeliveryZoneMap.toDomain(newUser)
        } catch (error: any) {
            console.log(error.meta.target[0] === 'title')
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    error.meta.target[0] === 'title' &&     {
                        type: 'title',
                        message: 'такое название уже есть'
                    }
                ]
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.delivery_zones.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }
}
