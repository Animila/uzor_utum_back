import {IDiscountRepository} from "../../../repositories/IDiscountRepository";
import {Discount} from "../../../domain/discount/discount";
import {PrismaClient} from "@prisma/client";
import {DiscountMap} from "../../../mappers/DiscountMap";

export class PrismaDiscountRepo implements IDiscountRepository {
    private prisma = new PrismaClient();

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.discounts.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такая категория не найдена'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Discount | null> {
        try {
            const data = await this.prisma.discounts.findUnique({where: {id: id}})
            if (!data) return null
            return DiscountMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findByProduct(productId: string): Promise<Discount | null> {
        try {
            const data = await this.prisma.discounts.findFirst({
                where: {
                    product_id: productId,
                    activated: true,
                    end_date: {gt: new Date()}
                }
            })
            if (!data) return null
            return DiscountMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Discount): Promise<Discount | null> {
        try {
            const dataPer = DiscountMap.toPersistence(data)
            const newData = await this.prisma.discounts.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    product_id: dataPer.product_id,
                    activated: dataPer.activated,
                    percentage: dataPer.percentage,
                    start_date: dataPer.start_date,
                    end_date: dataPer.end_date,
                },
                update: {
                    id: dataPer.id,
                    product_id: dataPer.product_id,
                    activated: dataPer.activated,
                    percentage: dataPer.percentage,
                    start_date: dataPer.start_date,
                    end_date: dataPer.end_date,
                }
            })
            if(!newData) return null
            return DiscountMap.toDomain(newData)
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
}
