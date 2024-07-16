import {PrismaClient} from "@prisma/client";
import {ISizeRepository} from "../../../repositories/ISizeRepository";
import {Size} from "../../../domain/products/sizes";
import {SizeMap} from "../../../mappers/SizeMap";

export class PrismaSizesRepo implements ISizeRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Size[]> {
        const data = await this.prisma.sizes.findMany()
        return data.map(Size => SizeMap.toDomain(Size)).filter(size => size != null)
    }

    async findById(id: string): Promise<Size | null> {
        const data = await this.prisma.sizes.findUnique({
            where: {
                id: id
            }
        })
        if(!data) return null
        return SizeMap.toDomain(data)
    }

    async findByTitle(title: string): Promise<Size | null> {
        const data = await this.prisma.sizes.findFirst({
            where: {
                title: title
            }
        })
        if(!data) return null
        return SizeMap.toDomain(data)
    }

    async save(Size: Size): Promise<Size | null> {
        try {
            const data = SizeMap.toPersistence(Size)
            const newUser = await this.prisma.sizes.upsert({
                where: {id: data.id},
                create: {
                    id: data.id,
                    title: data.title,
                },
                update: {
                    id: data.id,
                    title: data.title,
                }
            })
            if(!newUser) return null
            return SizeMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.sizes.delete({
                where: {
                    id: id
                }
            })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой размер не найден'
            }));

        }
    }





}