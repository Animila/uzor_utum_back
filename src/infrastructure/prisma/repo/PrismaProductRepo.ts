import {PrismaClient, Sex} from "@prisma/client";
import {IProductRepository} from "../../../repositories/IProductRepository";
import {Product} from "../../../domain/products/product";
import {ProductMap} from "../../../mappers/ProductMap";

export class PrismaProductRepo implements IProductRepository {

    private prisma = new PrismaClient();

    async findAll(
        categoryId?: string,
        materialId?: string,
        probIds?: string[],
        decorationIds?: string[],
        discount_at?: boolean,
        sizeIds?: string[],
        sortBy?: string,
        order?: "asc" | "desc",
        search?: string,
        minPrice?: number,
        maxPrice?: number,
        sex?: string,
        limit?: number,
        offset?: number
    ): Promise<{data: Product[], count: number}> {
        try {

            const where: any = {};
            if (categoryId) where.category_id = categoryId;
            if (materialId) where.material_id = materialId;
            if (sex) where.sex = sex;
            if (probIds) where.prob_ids = {hasSome: probIds};
            if (decorationIds) where.decoration_ids = {hasSome: decorationIds};
            if (sizeIds) where.size_ids = {hasSome: sizeIds};

            if (discount_at !== undefined) {
                where.discounts = discount_at
                    ? { some: { activated: true, end_date: { gt: new Date() } } }
                    : { none: { activated: true, end_date: { gt: new Date() } } };
            }


            if (minPrice !== undefined && maxPrice !== undefined) where.price = {gte: minPrice, lte: maxPrice};
            else if (minPrice !== undefined) where.price = {gte: minPrice};
            else if (maxPrice !== undefined) where.price = {lte: maxPrice};

            if (search) {
                where.OR = [
                    {title: {contains: search, mode: 'insensitive'}},
                    {article: {contains: search, mode: 'insensitive'}},
                    {description: {contains: search, mode: 'insensitive'}},
                    {details: {contains: search, mode: 'insensitive'}},
                    {delivery: {contains: search, mode: 'insensitive'}},
                ];
            }

            const orderBy = sortBy ? {[sortBy]: order} : undefined;
            const countData = await this.prisma.products.count({
                where: where,
            })
            const products = await this.prisma.products.findMany({
                where: where,
                orderBy,
                take: limit, // Ограничение на количество элементов
                skip: offset! * limit!
            });
            const result = products.map(product => ProductMap.toDomain(product)).filter(product => product != null);
            return {
                data: result,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }


    async findById(id: string): Promise<Product | null> {
        try {
            const data = await this.prisma.products.findUnique({where: {id: id}})
            if (!data) return null
            this.prisma.$disconnect()
            return ProductMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Product): Promise<Product | null> {
        try {
            const dataPer = ProductMap.toPersistence(data)
            const newUser = await this.prisma.products.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    title: dataPer.title,
                    sex: dataPer.sex as Sex,
                    article: dataPer.article,
                    delivery: dataPer.delivery,
                    details: dataPer.details,
                    created_at: new Date(),
                    updated_at: new Date(),
                    available: dataPer.available,
                    decoration_ids: dataPer.decoration_ids,
                    prob_ids: dataPer.prob_ids,
                    size_ids: dataPer.size_ids,
                    category_id: dataPer.category_id,
                    material_id: dataPer.material_id,
                    price: dataPer.price,
                    description: dataPer.description
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                    sex: dataPer.sex as Sex,
                    article: dataPer.article,
                    delivery: dataPer.delivery,
                    details: dataPer.details,
                    created_at: dataPer.created_at,
                    updated_at: new Date(),
                    available: dataPer.available,
                    decoration_ids: dataPer.decoration_ids,
                    prob_ids: dataPer.prob_ids,
                    size_ids: dataPer.size_ids,
                    category_id: dataPer.category_id,
                    material_id: dataPer.material_id,
                    price: dataPer.price,
                    description: dataPer.description
                }
            })
            if(!newUser) return null
            return ProductMap.toDomain(newUser)
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        } finally {
            this.prisma.$disconnect()
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.products.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой продукт не найден'
            }));
        } finally {
            this.prisma.$disconnect()
        }
    }
}
