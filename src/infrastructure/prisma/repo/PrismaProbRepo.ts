import {PrismaClient} from "@prisma/client";
import {ProbMap} from "../../../mappers/ProbMap";
import {IProbRepository} from "../../../repositories/IProbRepository";
import {Prob} from "../../../domain/products/probs";

export class PrismaProbRepo implements IProbRepository {
    private prisma = new PrismaClient();


    async findAll(): Promise<Prob[]> {
        const data = await this.prisma.probs.findMany()
        return data.map(result => ProbMap.toDomain(result)).filter(material => material != null)
    }

    async findById(id: string): Promise<Prob | null> {
        const data = await this.prisma.probs.findUnique({ where: { id: id } })
        if(!data) return null
        return ProbMap.toDomain(data)
    }

    async findByTitle(title: string): Promise<Prob | null> {
        const data = await this.prisma.probs.findFirst({ where: { title: title } })
        if(!data) return null
        return ProbMap.toDomain(data)
    }

    async save(data: Prob): Promise<Prob | null> {
        try {
            const dataPer = ProbMap.toPersistence(data)
            const newUser = await this.prisma.probs.upsert({
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
            return ProbMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.probs.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));
        }
    }
}