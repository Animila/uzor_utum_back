import {INewsRepository} from "../../../repositories/INewsRepository";
import {PrismaClient} from "@prisma/client";
import {News} from "../../../domain/news/news";
import {NewsMap} from "../../../mappers/NewsMap";

export class PrismaNewsRepo implements INewsRepository {
    private prisma = new PrismaClient();

    async findAll(journalId?: string, old?: boolean, popular?: boolean): Promise<News[]> {
        const where: any = {};
        if (journalId) where.journal_id = journalId;

        const orderBy: any = [];
        if (old) orderBy.push({ created_at: 'asc' });
        else if (popular) orderBy.push({ views: 'desc' });
        else orderBy.push({ created_at: 'desc' });

        const data = await this.prisma.news.findMany({ where: where, orderBy: orderBy })
        return data.map(journal => NewsMap.toDomain(journal)).filter(item => item != null)
    }

    async findById(id: string): Promise<News | null> {
        const data = await this.prisma.news.findUnique({ where: { id: id } })
        if(!data) return null
        return NewsMap.toDomain(data)
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
                    preview_path: dataPer.preview_path,
                    created_at: dataPer.created_at
                },
                update: {
                    id: dataPer.id,
                    title: dataPer.title,
                    about: dataPer.about,
                    text: dataPer.text,
                    views: dataPer.views,
                    journal_id: dataPer.journal_id,
                    preview_path: dataPer.preview_path,
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
        }
    }
}