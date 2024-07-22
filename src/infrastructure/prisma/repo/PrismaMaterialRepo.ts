import {PrismaClient} from "@prisma/client";
import {MaterialMap} from "../../../mappers/MaterialMap";
import {IMaterialRepository} from "../../../repositories/IMaterialRepository";
import {Material} from "../../../domain/products/materials";

export class PrismaMaterialRepo implements IMaterialRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Material[]> {
        const data = await this.prisma.materials.findMany()
        return data.map(Material => MaterialMap.toDomain(Material)).filter(material => material != null)
    }

    async findById(id: string): Promise<Material | null> {
        const data = await this.prisma.materials.findUnique({ where: { id: id } })
        if(!data) return null
        return MaterialMap.toDomain(data)
    }

    async findByTitle(title: string): Promise<Material | null> {
        const data = await this.prisma.materials.findFirst({ where: { title: title } })
        if(!data) return null
        return MaterialMap.toDomain(data)
    }

    async save(data: Material): Promise<Material | null> {
        try {
            const dataPer = MaterialMap.toPersistence(data)
            const newUser = await this.prisma.materials.upsert({
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
            return MaterialMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.materials.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));
        }
    }
}