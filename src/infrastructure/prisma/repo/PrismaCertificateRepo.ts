import {ICertificateRepository} from "../../../repositories/ICertificateRepository";
import {Certificate} from "../../../domain/certificate/certificate";
import {CertificateMap} from "../../../mappers/CertificateMap";
import {PrismaClient} from "@prisma/client";

export class PrismaCertificateRepo implements ICertificateRepository{

    private prisma = new PrismaClient()

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.certificates.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой сертификат не найден'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async findAll(limit: number, offset: number, certificate_type_id?: string, search?: string): Promise<{data: Certificate[], count: number}> {
        try {
            const where: any = {};
            if (certificate_type_id) where.certificate_type_id = certificate_type_id;
            if (search) where.OR = [
                { phone: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
            const countData = await this.prisma.certificates.count({
                where: where
            })
            const data = await this.prisma.certificates.findMany({
                where: where,
                take: limit,
                skip: limit * offset
            })
            const result = data.map(item => CertificateMap.toDomain(item)).filter(item => item != null)
            return {
                data: result,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async findById(id: string): Promise<Certificate | null> {
        try {
            const data = await this.prisma.certificates.findUnique({where: {id: id}})
            if (!data) return null
            return CertificateMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(certificate: Certificate): Promise<Certificate | null> {
        try {
            const dataPer = CertificateMap.toPersistence(certificate)
            const result = await this.prisma.certificates.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    user_id: dataPer.user_id,
                    email: dataPer.email,
                    delivery_at: dataPer.delivery_at,
                    phone: dataPer.phone,
                    accepted: dataPer.accepted,
                    certificate_type_id: dataPer.certificate_type_id,
                    activated: dataPer.activated,
                    code: dataPer.code,
                    order_id: dataPer.order_id
                },
                update: {
                    id: dataPer.id,
                    user_id: dataPer.user_id,
                    email: dataPer.email,
                    delivery_at: dataPer.delivery_at,
                    phone: dataPer.phone,
                    accepted: dataPer.accepted,
                    certificate_type_id: dataPer.certificate_type_id,
                    activated: dataPer.activated,
                    code: dataPer.code,
                    order_id: dataPer.order_id

                }
            })
            if(!result) return null
            return CertificateMap.toDomain(result)
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

    async findByCode(code: string): Promise<Certificate | null> {
        try {
            const result = await this.prisma.certificates.findUnique({
                where: {
                    code: code,
                    activated: false
                }
            })
            if (!result) return null
            return CertificateMap.toDomain(result)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async getStats(): Promise<{priceTotal: number, certificateData: any}> {
        const data = await this.prisma.certificates.findMany({
            select: {
                certificate_type: true,
                accepted: true
            }
        });

        const certificateSales = await this.prisma.certificates.groupBy({
            by: ['delivery_at'], // Группируем по дате доставки сертификатов
            _count: {
                id: true, // Подсчитываем количество сертификатов
            },
        });

        let price = 0
        data.map(item => {
            price += item.certificate_type.value
        })

        return {
            priceTotal: price,
            certificateData: certificateSales
        }
    }

}
