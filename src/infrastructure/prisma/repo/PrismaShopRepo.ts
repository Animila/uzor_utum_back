import {IShopRepository} from "../../../repositories/IShopRepository";
import {PrismaClient} from "@prisma/client";
import {Shop} from "../../../domain/shop/shop";
import {ShopMap} from "../../../mappers/ShopMap";

export class PrismaShopRepo implements IShopRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number ): Promise<{data: Shop[], count: number}> {
        try {
            const countData = await this.prisma.shops.count()
            const data = await this.prisma.shops.findMany({
                take: limit,
                skip: limit * offset})
            const result = data.map(shop => ShopMap.toDomain(shop)).filter(shop => shop != null)
            return {
                data: result,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Shop | null> {
        try {
            const data = await this.prisma.shops.findUnique({where: {id: id}})
            if (!data) return null
            return ShopMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Shop): Promise<Shop | null> {
        try {
            const dataPer = ShopMap.toPersistence(data)
            const newUser = await this.prisma.shops.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    title: dataPer.title,
                    address: dataPer.address,
                    latitude: dataPer.latitude,
                    longitude: dataPer.longitude,
                    email: dataPer.email,
                    phone: dataPer.phones,
                    time: dataPer.times as any
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                    address: dataPer.address,
                    latitude: dataPer.latitude,
                    longitude: dataPer.longitude,
                    email: dataPer.email,
                    phone: dataPer.phones,
                    time: dataPer.times as any
                }
            })
            if(!newUser) return null
            return ShopMap.toDomain(newUser)
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

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.shops.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой магазин не найден'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
