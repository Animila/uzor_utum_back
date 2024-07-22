import {PrismaClient, Sex} from "@prisma/client";
import {IProductRepository} from "../../../repositories/IProductRepository";
import {Product} from "../../../domain/products/product";
import {ProductMap} from "../../../mappers/ProductMap";

export class PrismaProductRepo implements IProductRepository {
    private prisma = new PrismaClient();

    async findAll(
        categoryId?: string,
        materialId?: string,
        filters?: JSON,
        sortBy?: string,
        order?: "asc" | "desc",
        search?: string,
        minPrice?: number,
        maxPrice?: number
    ): Promise<Product[]> {
        const where: any = {};
        if (categoryId) where.category_id = categoryId;
        if (materialId) where.material_id = materialId;

        if (filters) {
            where.OR = Object.entries(filters).map(([key, value]) => {
                if (Array.isArray(value)) return { attributes: { path: [key],  array_contains: value } };
                else return { attributes: { path: [key], equals: value } };
            });
        }

        if (minPrice !== undefined && maxPrice !== undefined) where.price = { gte: minPrice, lte: maxPrice };
        else if (minPrice !== undefined) where.price = { gte: minPrice };
        else if (maxPrice !== undefined) where.price = { lte: maxPrice };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { article: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { details: { contains: search, mode: 'insensitive' } },
                { delivery: { contains: search, mode: 'insensitive' } },
            ];
        }

        const orderBy = sortBy ? { [sortBy]: order } : undefined;
        const products = await this.prisma.products.findMany({ where, orderBy });
        return products.map(product => ProductMap.toDomain(product)).filter(product => product != null);
    }


    async findById(id: string): Promise<Product | null> {
        const data = await this.prisma.products.findUnique({ where: { id: id } })
        if(!data) return null
        return ProductMap.toDomain(data)
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
                    attributes: dataPer.attributes as any,
                    category_id: dataPer.categoryId,
                    material_id: dataPer.materialId,
                    price: dataPer.price,
                    description: dataPer.description,
                    path_images: dataPer.path_images
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                    sex: dataPer.sex as Sex,
                    article: dataPer.article,
                    delivery: dataPer.delivery,
                    details: dataPer.details,
                    created_at: dataPer.createdAt,
                    updated_at: new Date(),
                    available: dataPer.available,
                    attributes: dataPer.attributes as any,
                    category_id: dataPer.categoryId,
                    material_id: dataPer.materialId,
                    price: dataPer.price,
                    description: dataPer.description,
                    path_images: dataPer.path_images
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
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.products.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));
        }
    }
}