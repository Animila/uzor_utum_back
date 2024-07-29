import {PrismaClient} from "@prisma/client";
import {ICertificateTypeRepository} from "../../../repositories/ICertificateTypeRepository";
import {CertificateType} from "../../../domain/certificate/certificateType";
import {CertificateTypeMap} from "../../../mappers/CertificateTypeMap";

export class PrismaCertificateTypeRepo implements ICertificateTypeRepository{

    private prisma = new PrismaClient()

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.certificate_types.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой номинал сертификата не найден'
            }));
        }
    }

    async findAll(): Promise<CertificateType[]> {
        const result = await this.prisma.certificate_types.findMany()
        return result.map(item => CertificateTypeMap.toDomain(item)).filter(item => item != null)

    }

    async findById(id: string): Promise<CertificateType | null> {
        const data = await this.prisma.certificate_types.findUnique({ where: { id: id } })
        if(!data) return null
        return CertificateTypeMap.toDomain(data)
    }

    async save(data: CertificateType): Promise<CertificateType | null> {
        try {
            const dataPer = CertificateTypeMap.toPersistence(data)
            const result = await this.prisma.certificate_types.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    value: dataPer.value,
                    description: dataPer.description,
                },
                update: {
                    id: dataPer.id,
                    value: dataPer.value,
                    description: dataPer.description,
                }
            })
            if(!result) return null

            return CertificateTypeMap.toDomain(result)
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        }
    }

}