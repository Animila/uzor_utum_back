import {PrismaClient} from "@prisma/client";
import {ProbMap} from "../../../mappers/ProbMap";
import {IProbRepository} from "../../../repositories/IProbRepository";
import {Prob} from "../../../domain/products/probs";

export class PrismaProbRepo implements IProbRepository {
    private prisma = new PrismaClient();


    async findAll(limit: number, offset: number ): Promise<{data: Prob[], count: number}> {
        try {
            const countData = await this.prisma.probs.count()
            const data = await this.prisma.probs.findMany({
                take: limit,
                skip: limit * offset})
            const result = data.map(result => ProbMap.toDomain(result)).filter(material => material != null)
            return {
                data: result,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Prob | null> {
        try {
            const data = await this.prisma.probs.findUnique({where: {id: id}})
            if (!data) return null
            return ProbMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findByTitle(title: string): Promise<Prob | null> {
        try {
            const data = await this.prisma.probs.findFirst({where: {title: title}})
            if (!data) return null
            return ProbMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
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
            console.log(error)
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        } finally {
            await this.prisma.$disconnect();
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
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
