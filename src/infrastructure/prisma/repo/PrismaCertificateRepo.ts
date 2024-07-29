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
        }
    }

    async findAll(certificate_type_id?: string): Promise<Certificate[]> {
        const result = await this.prisma.certificates.findMany({
            where: {
                certificate_type_id: certificate_type_id
            }
        })
        return result.map(item => CertificateMap.toDomain(item)).filter(item => item != null)

    }

    async findById(id: string): Promise<Certificate | null> {
        const data = await this.prisma.certificates.findUnique({ where: { id: id } })
        if(!data) return null
        return CertificateMap.toDomain(data)
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
        }
    }

    async findByCode(code: string): Promise<Certificate | null> {
        const result = await this.prisma.certificates.findUnique({
            where: {
                code: code
            }
        })
        if(!result) return null
        return CertificateMap.toDomain(result)
    }

}