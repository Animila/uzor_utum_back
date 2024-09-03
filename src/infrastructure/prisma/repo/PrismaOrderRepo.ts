import {PrismaClient, Sex, StatusPayment} from "@prisma/client";
import {IOrderRepository} from "../../../repositories/IOrderRepository";
import {Order} from "../../../domain/order/order";
import {OrderMap} from "../../../mappers/OrderMap";

export class PrismaOrderRepo implements IOrderRepository {

    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number, token?:string, user_id?:string, shop_id?: string, status?: string[], send_type_id?: string, search?: string, created_at?: Date, updated_at?: Date): Promise<{data: Order[], count: number}> {
        try {
            const where: any = {};
            if (token) where.token = token;
            if (user_id) where.user_id = user_id;
            if (shop_id) where.shop_id = shop_id;
            if (created_at) where.created_at = created_at;
            if (updated_at) where.updated_at = updated_at;
            if (send_type_id) where.send_type_id = send_type_id;
            if (status && status.length > 0)  where.status = { in: status };

            if (search) {
                where.OR = [
                    { address: { contains: search, mode: 'insensitive' } },
                    { first_name: { contains: search, mode: 'insensitive' } },
                    { last_name: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ];
            }

            const countData = await this.prisma.orders.count({where: where})
            const data = await this.prisma.orders.findMany({where,
                orderBy: {
                    created_at: 'desc'
                },
                take: limit,
                skip: limit * offset});
            const result =  data.map(item => OrderMap.toDomain(item)).filter(product => product != null);
            return {
                data: result,
                count: countData
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }


    async findById(id: string): Promise<Order | null> {
        try {
            const data = await this.prisma.orders.findUnique({where: {id: id}})
            if (!data) return null
            this.prisma.$disconnect()
            return OrderMap.toDomain(data)
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: Order): Promise<Order | null> {
        try {
            const dataPer = OrderMap.toPersistence(data)
            const newUser = await this.prisma.orders.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    user_id: dataPer.user_id,
                    token: dataPer.token,
                    created_at: dataPer.created_at,
                    updated_at: dataPer.updated_at,
                    status: dataPer.status as StatusPayment,
                    address: dataPer.address,
                    cabinet: dataPer.cabinet,
                    apartament: dataPer.apartament,
                    comment: dataPer.comment,
                    email: dataPer.email,
                    house: dataPer.house,
                    receiver_id: dataPer.receiver_id,
                    phone: dataPer.phone,
                    add_bonuses: dataPer.add_bonus,
                    delivery_at: dataPer.delivery_at,
                    first_name: dataPer.first_name,
                    last_name: dataPer.last_name,
                    postal_code: dataPer.postal_code,
                    certificate_id: dataPer.certificate_id,
                    send_type_id: dataPer.send_type_id,
                    payment_id: dataPer.payment_id,
                    shop_id: dataPer.shop_id,
                    promocode_id: dataPer.promocode_id,
                    total_amount: dataPer.total_amount,
                    use_bonus: dataPer.use_bonus,
                    items: dataPer.items,
                },
                update: {
                    id: dataPer.id,
                    user_id: dataPer.user_id,
                    token: dataPer.token,
                    created_at: dataPer.created_at,
                    updated_at: dataPer.updated_at,
                    status: dataPer.status as StatusPayment,
                    address: dataPer.address,
                    cabinet: dataPer.cabinet,
                    apartament: dataPer.apartament,
                    comment: dataPer.comment,
                    email: dataPer.email,
                    house: dataPer.house,
                    receiver_id: dataPer.receiver_id,
                    phone: dataPer.phone,
                    add_bonuses: dataPer.add_bonus,
                    delivery_at: dataPer.delivery_at,
                    first_name: dataPer.first_name,
                    last_name: dataPer.last_name,
                    postal_code: dataPer.postal_code,
                    certificate_id: dataPer.certificate_id,
                    send_type_id: dataPer.send_type_id,
                    payment_id: dataPer.payment_id,
                    shop_id: dataPer.shop_id,
                    promocode_id: dataPer.promocode_id,
                    total_amount: dataPer.total_amount,
                    use_bonus: dataPer.use_bonus,
                    items: dataPer.items,
                }
            })
            if(!newUser) return null
            return OrderMap.toDomain(newUser)
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        } finally {
            this.prisma.$disconnect()
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.orders.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой заказ не найден'
            }));
        } finally {
            this.prisma.$disconnect()
        }
    }

    async getStats(): Promise<{
        count: number,
        items: any,
        sales: any
    }> {
        try {
            const data = await this.prisma.orders.aggregate({
                _count: true,
            })
            const sales = await this.prisma.orders.groupBy({
                by: ['created_at'],
                _sum: {
                    total_amount: true,
                },
            });
            const getAllItems = await this.prisma.orders.findMany({
                select: {
                    items: true,
                    total_amount: true
                }
            })

            return {
                count: data._count,
                items: getAllItems,
                sales: sales
            }
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
