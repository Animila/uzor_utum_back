import {IBonusRepository} from "../../../repositories/IBonusRepository";
import {Bonus} from "../../../domain/bonus/bonus";
import {BonusesType, PrismaClient} from "@prisma/client";
import {BonusMap} from "../../../mappers/BonusMap";

export class PrismaBonusRepository implements IBonusRepository {
    private prisma = new PrismaClient()

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.bonuses.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой бонус не найден'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findAll( limit: number, offset: number, user_id?: string, old?: boolean): Promise<{data: Bonus[], count: number}> {
        try {
            const orderBy: any = [];
            if (old) orderBy.push({created_at: 'asc'});
            else orderBy.push({created_at: 'desc'});

            const countData = await this.prisma.bonuses.count({
                where: {
                    user_id: user_id
                }
            })
            const data = await this.prisma.bonuses.findMany({
                where: {
                    user_id: user_id
                },
                orderBy: orderBy,
                take: limit,
                skip: offset * limit
            })
            const res = data.map(itemPer => BonusMap.toDomain(itemPer)).filter(item => item != null )
            return {
                data: res,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Bonus | null> {
        try {
            const data = await this.prisma.bonuses.findUnique({ where: { id: id } })
            if(!data) return null
            return BonusMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Bonus): Promise<Bonus | null> {
        try {
            const dataPer = BonusMap.toPersistence(data)
            const newData = await this.prisma.bonuses.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    count: dataPer.count,
                    created_at: dataPer.created_at,
                    type: dataPer.type as BonusesType,
                    user_id: dataPer.user_id,
                    description: dataPer.description,
                },
                update: {
                    id: dataPer.id,
                    count: dataPer.count,
                    created_at: dataPer.created_at,
                    type: dataPer.type as BonusesType,
                    user_id: dataPer.user_id,
                    description: dataPer.description,
                }
            })
            if(!newData) return null
            return BonusMap.toDomain(newData)
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

    async sum(user_id?: string): Promise<number> {
        try {
            const pos_data = await this.prisma.bonuses.aggregate({
                _sum: {
                    count: true
                },
                where: {
                    type: 'plus',
                    user_id: user_id ? user_id : undefined,
                }
            })
            const min_data = await this.prisma.bonuses.aggregate({
                _sum: {
                    count: true
                },
                where: {
                    type: 'minus',
                    user_id: user_id ? user_id : undefined,
                }
            })
            const result = (pos_data._sum.count || 0) - (min_data._sum.count || 0)
            return result > 0 ? result : 0
        } finally {
            await this.prisma.$disconnect();
        }
    }

}
