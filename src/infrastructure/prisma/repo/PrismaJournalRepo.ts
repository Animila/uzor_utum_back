import {PrismaClient} from "@prisma/client";
import {IJournalRepository} from "../../../repositories/IJournalRepository";
import {Journal} from "../../../domain/news/journal";
import {JournalMap} from "../../../mappers/JournalMap";

export class PrismaJournalRepo implements IJournalRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Journal[]> {
        try {
            const data = await this.prisma.journals.findMany()
            return data.map(journal => JournalMap.toDomain(journal)).filter(item => item != null)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Journal | null> {
        try {
            const data = await this.prisma.journals.findUnique({where: {id: id}})
            if (!data) return null
            return JournalMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Journal): Promise<Journal | null> {
        try {
            const dataPer = JournalMap.toPersistence(data)
            const newUser = await this.prisma.journals.upsert({
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
            return JournalMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.journals.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой журнал не найден'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }
}