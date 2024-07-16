import {PrismaClient} from "@prisma/client";
import {IDecorTypeRepository} from "../../../repositories/IDecorTypeRepository";
import {DecorationType} from "../../../domain/products/decor_types";
import {DecorationTypeMap} from "../../../mappers/DecorationTypeMap";

export class PrismaDecorTypeRepo implements IDecorTypeRepository {
    private prisma = new PrismaClient();

    async findAll(): Promise<DecorationType[]> {
        const data = await this.prisma.decor_types.findMany()
        return data.map(DecorationType => DecorationTypeMap.toDomain(DecorationType)).filter(decor_type => decor_type != null)
    }

    async findById(id: string): Promise<DecorationType | null> {
        const data = await this.prisma.decor_types.findUnique({
            where: {
                id: id
            }
        })
        if(!data) return null
        return DecorationTypeMap.toDomain(data)
    }

    async findByTitle(title: string): Promise<DecorationType | null> {
        const data = await this.prisma.decor_types.findFirst({
            where: {
                title: title
            }
        })
        if(!data) return null
        return DecorationTypeMap.toDomain(data)
    }

    async save(DecorationType: DecorationType): Promise<DecorationType | null> {
        try {
            const data = DecorationTypeMap.toPersistence(DecorationType)
            const newUser = await this.prisma.decor_types.upsert({
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
            return DecorationTypeMap.toDomain(newUser)
        } catch (error) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.decor_types.delete({
                where: {
                    id: id
                }
            })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой размер не найден'
            }));

        }
    }





}