import {IDiscountRepository} from "../../../repositories/IDiscountRepository";
import {Discount} from "../../../domain/discount/discount";
import {PrismaClient} from "@prisma/client";
import {DiscountMap} from "../../../mappers/DiscountMap";

export class PrismaDiscountRepo implements IDiscountRepository {
    private prisma = new PrismaClient();

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.discounts.delete({
                where: {
                    id: id
                }
            })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такая категория не найдена'
            }));

        }
    }

    async findById(id: string): Promise<Discount | null> {
        const data = await this.prisma.discounts.findUnique({
            where: {
                id: id
            }
        })
        if(!data) return null
        return DiscountMap.toDomain(data)
    }

    async findByProduct(productId: string): Promise<Discount | null> {
        const data = await this.prisma.discounts.findFirst({
            where: {
                product_id: productId,
                activated: true
            }
        })
        if(!data) return null
        return DiscountMap.toDomain(data)
    }

    async save(data: Discount): Promise<Discount | null> {
        try {
            const per_data = DiscountMap.toPersistence(data)
            const newData = await this.prisma.discounts.upsert({
                where: {id: per_data.id},
                create: {
                    id: per_data.id,
                    product_id: per_data.product_id,
                    activated: per_data.activated,
                    percentage: per_data.percentage,
                    start_date: per_data.start_date,
                    end_date: per_data.end_date,
                },
                update: {
                    id: per_data.id,
                    product_id: per_data.product_id,
                    activated: per_data.activated,
                    percentage: per_data.percentage,
                    start_date: per_data.start_date,
                    end_date: per_data.end_date,
                }
            })
            if(!newData) return null
            return DiscountMap.toDomain(newData)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

}