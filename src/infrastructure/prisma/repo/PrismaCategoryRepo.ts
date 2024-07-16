import {ICategoryRepository} from "../../../repositories/ICategoryRepository";
import {PrismaClient} from "@prisma/client";
import {Category} from "../../../domain/products/categories";
import {CategoryMap} from "../../../mappers/CategoryMap";

export class PrismaCategoryRepo implements ICategoryRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Category[]> {
        const data = await this.prisma.categories.findMany()
        return data.map(category => CategoryMap.toDomain(category)).filter(category => category != null)
    }

    async findById(id: string): Promise<Category | null> {
        const data = await this.prisma.categories.findUnique({
            where: {
                id: id
            }
        })
        if(!data) return null
        return CategoryMap.toDomain(data)
    }

    async findByTitle(title: string): Promise<Category | null> {
        const data = await this.prisma.categories.findFirst({
            where: {
                title: title
            }
        })
        if(!data) return null
        return CategoryMap.toDomain(data)
    }

    async save(category: Category): Promise<Category | null> {
        try {
            const data = CategoryMap.toPersistence(category)
            const newUser = await this.prisma.categories.upsert({
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
            return CategoryMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.categories.delete({
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





}