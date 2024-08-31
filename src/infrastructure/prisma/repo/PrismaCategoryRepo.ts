import {ICategoryRepository} from "../../../repositories/ICategoryRepository";
import {Category} from "../../../domain/products/categories";
import {CategoryMap} from "../../../mappers/CategoryMap";
import {PrismaClient} from '@prisma/client'
export class PrismaCategoryRepo implements ICategoryRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number ): Promise<{
        data: Category[],
        count: number
    }> {
        try {
            const countData = await this.prisma.categories.count()
            const data = await this.prisma.categories.findMany({
                take: limit,
                skip: limit * offset
            })
            const result = data.map(category => CategoryMap.toDomain(category)).filter(category => category != null)
            return {
                data: result,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Category | null> {
        try {
            const data = await this.prisma.categories.findUnique({where: {id: id}})
            if (!data) return null
            return CategoryMap.toDomain(data)
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async findByTitle(title: string): Promise<Category | null> {
        try {
            const data = await this.prisma.categories.findFirst({where: {title: title}})
            if (!data) return null
            return CategoryMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Category): Promise<Category | null> {
        try {
            const dataPer = CategoryMap.toPersistence(data)
            const newUser = await this.prisma.categories.upsert({
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
            return CategoryMap.toDomain(newUser)
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
            await this.prisma.categories.delete({ where: { id: id } })
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
}
