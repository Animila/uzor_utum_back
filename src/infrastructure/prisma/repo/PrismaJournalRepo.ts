import {PrismaClient} from "@prisma/client";
import {IJournalRepository} from "../../../repositories/IJournalRepository";
import {Journal} from "../../../domain/news/journal";
import {JournalMap} from "../../../mappers/JournalMap";
import {Discount} from "../../../domain/discount/discount";

export class PrismaJournalRepo implements IJournalRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<Journal[]> {
        const data = await this.prisma.journals.findMany()
        return data.map(journal => JournalMap.toDomain(journal)).filter(item => item != null)
    }

    async findById(id: string): Promise<Journal | null> {
        const data = await this.prisma.journals.findUnique({
            where: { id: id }
        })
        if(!data) return null
        return JournalMap.toDomain(data)
    }

    async save(Journal: Journal): Promise<Journal | null> {
        try {
            const data = JournalMap.toPersistence(Journal)
            const newUser = await this.prisma.journals.upsert({
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
            return JournalMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.journals.delete({
                where: { id: id }
            })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой журнал не найден'
            }));

        }
    }
}