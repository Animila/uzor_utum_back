import {PrismaClient} from "@prisma/client";
import {SizeMap} from "../../../mappers/SizeMap";
import {ISizeRepository} from "../../../repositories/ISizeRepository";
import {Size} from "../../../domain/products/sizes";

export class PrismaSizeRepo implements ISizeRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Size[]> {
        try {
            const data = await this.prisma.sizes.findMany()
            return data.map(result => SizeMap.toDomain(result)).filter(material => material != null)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Size | null> {
        try {
            const data = await this.prisma.sizes.findUnique({where: {id: id}})
            if (!data) return null
            return SizeMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findByTitle(title: string): Promise<Size | null> {
        try {
            const data = await this.prisma.sizes.findFirst({where: {title: title}})
            if (!data) return null
            return SizeMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Size): Promise<Size | null> {
        try {
            const dataPer = SizeMap.toPersistence(data)
            const newUser = await this.prisma.sizes.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    title: dataPer.title,
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                }
            })
            if(!newUser) return null
            return SizeMap.toDomain(newUser)
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
            await this.prisma.sizes.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }
}