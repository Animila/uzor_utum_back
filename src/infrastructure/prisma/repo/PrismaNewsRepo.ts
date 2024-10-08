import {INewsRepository} from "../../../repositories/INewsRepository";
import {PrismaClient} from "@prisma/client";
import {News} from "../../../domain/news/news";
import {NewsMap} from "../../../mappers/NewsMap";

export class PrismaNewsRepo implements INewsRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number, journalId?: string, old?: boolean, popular?: boolean, search?: string): Promise<{data: News[], count: number}> {
        try {
            const where: any = {};
            if (journalId) where.journal_id = journalId;

            const orderBy: any = [];
            if (old) orderBy.push({created_at: 'asc'});
            else if (popular) orderBy.push({views: 'desc'});
            else orderBy.push({created_at: 'desc'});

            if (search) {
                where.OR = [
                    {title: {contains: search, mode: 'insensitive'}},
                    {about: {contains: search, mode: 'insensitive'}},
                    {text: {contains: search, mode: 'insensitive'}},
                ];
            }

            const countData = await this.prisma.news.count({where: where})
            const data = await this.prisma.news.findMany({where: where, orderBy: orderBy,
                take: limit,
                skip: limit * offset})
            const result =  data.map(journal => NewsMap.toDomain(journal)).filter(item => item != null)
            return {
                data: result,
                count: countData,
            }
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
