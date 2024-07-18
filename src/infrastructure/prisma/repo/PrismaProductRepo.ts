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
                if (Array.isArray(value)) {
                    return {
                        attributes: {
                            path: [key],
                            array_contains: value,
                        }
                    };
                } else {
                    return {
                        attributes: {
                            path: [key],
                            equals: value,
                        }
                    };
                }
            });
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = { gte: minPrice, lte: maxPrice };
        } else if (minPrice !== undefined) {
            where.price = { gte: minPrice };
        } else if (maxPrice !== undefined) {
            where.price = { lte: maxPrice };
        }

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

        const products = await this.prisma.products.findMany({
            where,
            orderBy
        });
        return products.map(product => ProductMap.toDomain(product)).filter(product => product != null);

    }


    async findById(id: string): Promise<Product | null> {
        const data = await this.prisma.products.findUnique({
            where: {
                id: id
            }
        })
        if(!data) return null
        return ProductMap.toDomain(data)
    }

    async save(Material: Product): Promise<Product | null> {
        try {
            const data = ProductMap.toPersistence(Material)
            console.log(data)
            const newUser = await this.prisma.products.upsert({
                where: {id: data.id},
                create: {
                    id: data.id,
                    title: data.title,
                    sex: data.sex as Sex,
                    article: data.article,
                    delivery: data.delivery,
                    details: data.details,
                    created_at: new Date(),
                    updated_at: new Date(),
                    available: data.available,
                    attributes: data.attributes as any,
                    category_id: data.categoryId,
                    material_id: data.materialId,
                    price: data.price,
                    description: data.description,
                    path_images: data.path_images
                },
                update: {
                    id: data.id,
                    title: data.title,
                    sex: data.sex as Sex,
                    article: data.article,
                    delivery: data.delivery,
                    details: data.details,
                    created_at: data.createdAt,
                    updated_at: new Date(),
                    available: data.available,
                    attributes: data.attributes as any,
                    category_id: data.categoryId,
                    material_id: data.materialId,
                    price: data.price,
                    description: data.description,
                    path_images: data.path_images
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
            await this.prisma.products.delete({
                where: {
                    id: id
                }
            })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));

        }
    }
}