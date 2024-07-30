import {IShopRepository} from "../../../repositories/IShopRepository";
import {PrismaClient} from "@prisma/client";
import {Shop} from "../../../domain/shop/shop";
import {ShopMap} from "../../../mappers/ShopMap";

export class PrismaShopRepo implements IShopRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Shop[]> {
        const data = await this.prisma.shops.findMany()
        return data.map(shop => ShopMap.toDomain(shop)).filter(shop => shop != null)
    }

    async findById(id: string): Promise<Shop | null> {
        const data = await this.prisma.shops.findUnique({ where: { id: id } })
        if(!data) return null
        return ShopMap.toDomain(data)
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
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
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
        }
    }
}