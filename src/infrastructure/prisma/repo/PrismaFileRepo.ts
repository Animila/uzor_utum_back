import {PrismaClient} from "@prisma/client";
import {IFileRepo} from "../../../repositories/IFileRepository";
import {FileMap} from "../../../mappers/FileMap";
import {File} from '../../../domain/file/file'

export class PrismaFileRepo implements IFileRepo {
    prisma = new PrismaClient()
    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.files.delete({where: {id}})
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такая категория не найдена'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async getByEntityIdAndType(entity_type: string, entity_id: string): Promise<File[]> {
        try {
            const files = await this.prisma.files.findMany({
                where: { entity_type, entity_id }
            })
            return files.map((item: any) =>  FileMap.toDomain(item)).filter(item => item !== null)
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async getById(id: string): Promise<File | null> {
        try {
            const file = await this.prisma.files.findUnique({ where: {id} })
            if(!file) return null
            return FileMap.toDomain(file)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(file: File): Promise<File | null> {
        try {
            const dataPer = await FileMap.toPersistence(file)

            const newData = await this.prisma.files.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    entity_id: dataPer.entity_id,
                    entity_type: dataPer.entity_type,
                    name: dataPer.name,
                    path: dataPer.path,
                    typefile: dataPer.type_file
                },
                update: {
                    id: dataPer.id,
                    entity_id: dataPer.entity_id,
                    entity_type: dataPer.entity_type,
                    name: dataPer.name,
                    path: dataPer.path,
                    typefile: dataPer.type_file}
            })

            if(!newData) return null
            return FileMap.toDomain(newData)
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

}