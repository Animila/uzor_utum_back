import {INewsRepository} from "../../../repositories/INewsRepository";
import {PrismaClient} from "@prisma/client";
import {News} from "../../../domain/news/news";
import {NewsMap} from "../../../mappers/NewsMap";

export class PrismaNewsRepo implements INewsRepository {
    private prisma = new PrismaClient();

    async findAll(journalId?: string, old?: boolean, popular?: boolean): Promise<News[]> {
        try {
            const where: any = {};
            if (journalId) where.journal_id = journalId;

            const orderBy: any = [];
            if (old) orderBy.push({created_at: 'asc'});
            else if (popular) orderBy.push({views: 'desc'});
            else orderBy.push({created_at: 'desc'});

            const data = await this.prisma.news.findMany({where: where, orderBy: orderBy})
            return data.map(journal => NewsMap.toDomain(journal)).filter(item => item != null)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<News | null> {
        try {
            const data = await this.prisma.news.findUnique({where: {id: id}})
            if (!data) return null
            return NewsMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: News): Promise<News | null> {
        try {
            const dataPer = NewsMap.toPersistence(data)
            const newUser = await this.prisma.news.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    title: dataPer.title,
                    about: dataPer.about,
                    text: dataPer.text,
                    views: dataPer.views,
                    journal_id: dataPer.journal_id,
                    created_at: dataPer.created_at
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                    about: dataPer.about,
                    text: dataPer.text,
                    views: dataPer.views,
                    journal_id: dataPer.journal_id,
                    created_at: dataPer.created_at
                }
            })
            if(!newUser) return null
            return NewsMap.toDomain(newUser)
        } catch (error) {
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
            await this.prisma.news.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такая новость не найдена'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
