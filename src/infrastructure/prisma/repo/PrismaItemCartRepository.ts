import {PrismaClient} from "@prisma/client";
import {Guard} from "../../../domain/guard";
import {ICartItemRepository} from "../../../repositories/ICartItemRepository";
import {CartItem} from "../../../domain/cart/cartItem";
import {ItemCartMap} from "../../../mappers/ItemCartMap";

export class PrismaItemCartRepository implements ICartItemRepository {
    private prisma = new PrismaClient()

    async delete(id: string): Promise<CartItem|null> {
        try {
            const data = await this.prisma.cart_items.delete({ where: { id: id } })
            return ItemCartMap.toDomain(data)
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой пункт к корзине не найден'
            }));
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async find(limit: number, offset: number, cart_id?: string, id?: string): Promise<{data:CartItem[]|CartItem|null, count: number}> {
        try {
            const checkId = Guard.againstNullOrUndefined(id, 'id')

            if (checkId.succeeded) {
                const res = await this.prisma.cart_items.findUnique({
                    where: {id}
                })
                if (!res) return {
                    data: null,
                    count: 0
                }
                return {
                    data: ItemCartMap.toDomain(res),
                    count: 1
                }

            } else {
                const countData = await this.prisma.cart_items.count({
                    where: {cart_id}
                })
                const data = await this.prisma.cart_items.findMany({
                    where: {cart_id},
                    take: limit,
                    skip: limit * offset
                })
                const result = data.map(item => ItemCartMap.toDomain(item)).filter(item => item !== null)
                return {
                    data: result,
                    count: countData
                }
            }
        } catch (err) {
            console.log(err)
            return {
                data: null,
                count: 0
            }
        }finally {
            await this.prisma.$disconnect();
        }
    }

    async save(data: CartItem): Promise<CartItem | null> {
        try {
            const dataPer = ItemCartMap.toPersistence(data)

            const result = await this.prisma.cart_items.upsert({
                where: {
                    id: dataPer.id
                },
                create: {
                    id: dataPer.id,
                    cart_id: dataPer.cart_id,
                    product_id: dataPer.product_id,
                    size_id: dataPer.size_id,
                    proba_id: dataPer.proba_id,
                    decorate_id: dataPer.decorate_id,
                    count: dataPer.count,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                update: {
                    id: dataPer.id,
                    cart_id: dataPer.cart_id,
                    product_id: dataPer.product_id,
                    size_id: dataPer.size_id,
                    proba_id: dataPer.proba_id,
                    decorate_id: dataPer.decorate_id,
                    count: dataPer.count,
                    created_at: dataPer.created_at,
                    updated_at: new Date(),
                }

            })

            if (!result) return null

            return ItemCartMap.toDomain(result)
        } finally {
            await this.prisma.$disconnect();
        }
    }

}
