import {PrismaClient} from "@prisma/client";
import {IDecorateRepository} from "../../../repositories/IDecorateRepository";
import {DecorateMap} from "../../../mappers/DecorateMap";
import {Decorate} from "../../../domain/products/decorates";

export class PrismaDecorateRepo implements IDecorateRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Decorate[]> {
        const data = await this.prisma.decorations.findMany()
        return data.map(result => DecorateMap.toDomain(result)).filter(material => material != null)
    }

    async findById(id: string): Promise<Decorate | null> {
        const data = await this.prisma.decorations.findUnique({ where: { id: id } })
        if(!data) return null
        return DecorateMap.toDomain(data)
    }

    async findByTitle(title: string): Promise<Decorate | null> {
        const data = await this.prisma.decorations.findFirst({ where: { title: title } })
        if(!data) return null
        return DecorateMap.toDomain(data)
    }

    async save(data: Decorate): Promise<Decorate | null> {
        try {
            const dataPer = DecorateMap.toPersistence(data)
            const newUser = await this.prisma.decorations.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    title: dataPer.title
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                }
            })
            if(!newUser) return null
            return DecorateMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.decorations.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));
        }
    }
}