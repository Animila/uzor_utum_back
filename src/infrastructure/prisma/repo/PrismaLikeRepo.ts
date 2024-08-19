import {ILikeRepository} from "../../../repositories/ILikeRepository";
import {LikeType, PrismaClient} from "@prisma/client";
import {Like} from "../../../domain/like/like";
import {LikeMap} from "../../../mappers/LikeMap";

export class PrismaLikeRepo implements ILikeRepository {
    private prisma = new PrismaClient();

    async findAll(entity_type?: string, entity_id?: string, user_id?: string, type?: string): Promise<Like[]> {
        try {
            const data = await this.prisma.likes.findMany({
                where: {
                    entity_type,
                    entity_id,
                    user_id,
                    type: type as LikeType
                }
            })
            return data.map(Like => LikeMap.toDomain(Like)).filter(material => material != null)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Like | null> {
        try {
            const data = await this.prisma.likes.findUnique({where: {id: id}})
            if (!data) return null
            return LikeMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Like): Promise<Like | null> {
        try {
            const dataPer = LikeMap.toPersistence(data)
            const newUser = await this.prisma.likes.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    entity_type: dataPer.entity_type,
                    entity_id: dataPer.entity_id,
                    type: dataPer.type as LikeType,
                    user_id: dataPer.user_id,
                    created_at: dataPer.created_at
                },
                update: {
                    id: dataPer.id,
                    entity_type: dataPer.entity_type,
                    entity_id: dataPer.entity_id,
                    type: dataPer.type as LikeType,
                    user_id: dataPer.user_id,
                    created_at: dataPer.created_at
                }
            })
            if(!newUser) return null
            return LikeMap.toDomain(newUser)
        } catch (error) {
            console.log(error)
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
            await this.prisma.likes.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой материал не найден'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }
}
