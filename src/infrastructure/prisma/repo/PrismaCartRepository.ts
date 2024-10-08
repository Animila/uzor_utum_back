import {ICartRepository} from "../../../repositories/ICartRepository";
import {Cart} from "../../../domain/cart/cart";
import {CartMap} from "../../../mappers/CartMap";
import {PrismaClient} from "@prisma/client";
import {Guard} from "../../../domain/guard";

export class PrismaCartRepository implements ICartRepository {
    private prisma = new PrismaClient()

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.carts.delete({ where: { id: id } })
            return true
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такая корзина не найдена'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async find(token: string, userId?: string, id?: string): Promise<Cart | null> {
        try {
            let existingData: any


            const checkId = Guard.againstNullOrUndefined(id, 'id')

            if (checkId.succeeded) {
                const res = await this.prisma.carts.findUnique({
                    where: {id: id}
                })
                if (!res) return null
                return CartMap.toDomain(res)
            } else {
                existingData = await this.prisma.carts.findFirst({
                    where: {
                        OR: [
                            {token: token},
                            {user_id: userId}
                        ]
                    }
                })

                if (!existingData) {
                    const newCart = new Cart({
                        token: token,
                        totalAmount: 0,
                        userId: userId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    await this.save(newCart)
                    return newCart
                }

                const cart = CartMap.toDomain(existingData)


                if (cart) {
                    const checkUserId = Guard.againstNullOrUndefined(cart.getUserId(), 'user_id')
                    if (!checkUserId.succeeded) {
                        cart.props.userId = userId
                        await this.save(cart)
                    }
                }
                return cart
            }
        } finally {
            await this.prisma.$disconnect();
        }

    }

    async save(data: Cart): Promise<Cart | null> {
        try {
            const dataPer = CartMap.toPersistence(data)

            const existingCart = await this.prisma.carts.findUnique({
                where: {token: dataPer.token}
            })

            let result
            if (existingCart) {
                // Update the existing cart
                result = await this.prisma.carts.update({
                    where: {id: dataPer.id},
                    data: {
                        id: dataPer.id,
                        token: dataPer.token,
                        user_id: dataPer.user_id,
                        total_amount: dataPer.total_amount,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                })
            } else {
                // Create a new cart
                result = await this.prisma.carts.create({
                    data: {
                        id: dataPer.id,
                        token: dataPer.token,
                        user_id: dataPer.user_id,
                        total_amount: dataPer.total_amount,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                })
            }

            if (!result) return null

            return CartMap.toDomain(result)
        }finally {
            await this.prisma.$disconnect();
        }
    }

}
