import {PrismaCartRepository} from "../../infrastructure/prisma/repo/PrismaCartRepository";
import {FastifyReply, FastifyRequest} from "fastify";
import {Guard} from "../../domain/guard";
import {CheckCart} from "../../useCases/cart/checkCart";
import {CartMap} from "../../mappers/CartMap";
import {PrismaUserRepo} from "../../infrastructure/prisma/repo/PrismaUserRepo";
import {GetUserById} from "../../useCases/user/userGetById";
import {PrismaItemCartRepository} from "../../infrastructure/prisma/repo/PrismaItemCartRepository";
import {AddItemToCart} from "../../useCases/cart/addItemToCart";
import {ItemCartMap} from "../../mappers/ItemCartMap";
import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import {GetByIdProducts} from "../../useCases/product/productGetById";
import {GetItemsCart} from "../../useCases/cart/getItemsCart";
import {DeleteItemCart} from "../../useCases/cart/deleteItemCart";
import {GetByIdItemCart} from "../../useCases/cart/getByIdItemCart";
import {CartItem} from "../../domain/cart/cartItem";
import {GetByIDCart} from "../../useCases/cart/getByIdCart";
import {PrismaDiscountRepo} from "../../infrastructure/prisma/repo/PrismaDiscountRepo";
import {GetByProductIdDiscount} from "../../useCases/discount/discountGetByProductId";

const cartRepo = new PrismaCartRepository()
const userRepo = new PrismaUserRepo()
const itemCartRepo = new PrismaItemCartRepository()
const productRepo = new PrismaProductRepo()
const discountRepo = new PrismaDiscountRepo()
export async function checkCartController(request: FastifyRequest<CartRequest>, reply: FastifyReply) {
    try {
        const {user_id, token} = request.query as CartRequest['Query']
        // const checkResult = Guard.againstNullOrUndefined(token, 'token')
        const checkUser = Guard.againstNullOrUndefined(user_id, 'user_id')


        // if(!checkResult.succeeded)
        //     throw new Error(JSON.stringify({
        //         status: 400,
        //         message: [
        //             {
        //                 type: 'token',
        //                 message: 'Обязательно должен быть'
        //             }
        //         ]
        //     }))


        if(checkUser.succeeded) {
            var getUser = new GetUserById(userRepo)
            await getUser.execute({user_id: user_id})
        }

        const checkData = new CheckCart(cartRepo)
        const result = await checkData.execute({user_id, token})
        const cartRep = CartMap.toPersistence(result)

        const getItems = new GetItemsCart(itemCartRepo)
        const data = await getItems.execute({cart_id: result.getId()})

        const getProduct = new GetByIdProducts(productRepo)
        const getDiscount = new GetByProductIdDiscount(discountRepo)

        result.props.totalAmount = 0
        for (const item of data) {
            let existingProduct, discountProduct
            try {
                existingProduct = await getProduct.execute({id: item.getProductId()})
                discountProduct = await getDiscount.execute({ product_id: existingProduct.getId() })
            } catch (e) {
                console.log(e)
            }
            const priceWithDiscount = existingProduct ? existingProduct.getPrice() * (discountProduct ? (100 - discountProduct.getPercentage()) / 100 : 1) : 0

            result.props.totalAmount += Math.floor(priceWithDiscount * item.getCount())
        }
        await cartRepo.save(result)
        cartRep.items = data.map(item => ItemCartMap.toPersistence(item))
        cartRep.total_amount = result.props.totalAmount

        reply.status(201).send({
            success: true,
            data: cartRep
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function addItemToCartController(request: FastifyRequest<ItemCartRequest>, reply: FastifyReply) {
    const { token } = request.query as ItemCartRequest['Query']
    const { size_id, proba_id, decorate_id, count, product_id } = request.body

    try {

    const resultCheck = Guard.againstNullOrUndefinedBulk([
        {argument: token, argumentName: 'token'},
        {argument: product_id, argumentName: 'product_id'},
        {argument: count, argumentName: 'count'},
    ])

    if(!resultCheck.succeeded || count <= 0)
        throw new Error(JSON.stringify({
            status: 400,
            message: [
                !token && {
                    type: 'token',
                    message: 'Обязательно должен быть token'
                },
                !product_id && {
                    type: 'product_id',
                    message: 'Обязательно должен быть продукт'
                },
                !count && {
                    type: 'count',
                    message: 'Обязательно должно быть количество'
                },
                count <= 0 && {
                    type: 'count',
                    message: 'Должно быть больше 0'
                },

            ]
        }))


        const getCart = new CheckCart(cartRepo)
        const existingCart = await getCart.execute({token: token})
        const addItemCart = new AddItemToCart(itemCartRepo)

        const getProduct = new GetByIdProducts(productRepo)
        const existingProduct = await getProduct.execute({id: product_id})
        const getDiscount = new GetByProductIdDiscount(discountRepo)

        if(existingProduct.getAvailable() < count)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'count',
                        message: `Достпуно для оформления ${existingProduct.getAvailable()}`
                    }
                ]
            }))

        let discountProduct: any;
        try {
            discountProduct = await getDiscount.execute({product_id})
        } catch (error: any) {
            console.log(error)
        }

        const newCart = await addItemCart.execute({
            cart_id: existingCart.getId(),
            size_id: size_id,
            decorate_id: decorate_id,
            proba_id: proba_id,
            count: count,
            product_id: existingProduct.getId()
        })

        const priceWithDiscount = existingProduct.getPrice() * (discountProduct ? (100 - discountProduct.getPercentage()) / 100 : 1)

        existingCart.props.totalAmount += priceWithDiscount * count
        existingProduct.props.available -= count
        await productRepo.save(existingProduct)
        await cartRepo.save(existingCart)

        reply.status(201).send({
            success: true,
            data: ItemCartMap.toPersistence(newCart)
        });


    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }

}

export async function changeItemCartController(request: FastifyRequest<ItemCartRequest>, reply: FastifyReply) {
    try {
        const {id} = request.query as ItemCartRequest['Query']
        const {product_id, count, decorate_id, size_id, proba_id} = request.body
        const checkIdResult = Guard.againstNullOrUndefined(id, 'id')
        if (!checkIdResult.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'id',
                        message: 'Обязательно должен быть'
                    }
                ]
            }))
        if (count <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'count',
                        message: 'Должно быть больше 0'
                    }
                ]
            }))

        const getData = new GetByIdItemCart(itemCartRepo)
        const getProduct = new GetByIdProducts(productRepo)
        const getCart = new GetByIDCart(cartRepo)
        const getDiscount = new GetByProductIdDiscount(discountRepo)

        const existingItem = await getData.execute({id})
        const existingProduct = await getProduct.execute({id: product_id ? product_id : existingItem.getProductId()})
        const existingCart = await getCart.execute({id: existingItem.getCartId()})

        if(existingItem.getCount() < count && (existingProduct.getAvailable() < count - existingItem.getCount()))
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'count',
                        message: `Достпуно для оформления ${existingProduct.getAvailable()}`
                    }
                ]
            }))

        let discountProduct: any;
        try {
            discountProduct = await getDiscount.execute({product_id})
        } catch (error: any) {
            console.log(error)
        }

        // товар со скидкой
        const priceWithDiscount = existingProduct.getPrice() * (discountProduct ? (100 - discountProduct.getPercentage()) / 100 : 1)
        const oldAmount = existingItem.getCount() * priceWithDiscount

        console.log(priceWithDiscount)
        console.log(oldAmount)

        const checkEquals = existingItem.getCount() === count
        if (!checkEquals)
            if (existingItem.getCount() > count) {
                // количество меньше текущего - убираю
                const newAmount = count * priceWithDiscount
                console.log(newAmount)
                existingCart.props.totalAmount = Math.floor(existingCart.getTotalAmount() - (oldAmount - newAmount))
                existingProduct.props.available += (existingItem.getCount() - count)
            } else {
                // количество больше текущего - убираю
                const newAmount = count * priceWithDiscount
                console.log(newAmount)
                existingCart.props.totalAmount = Math.floor(existingCart.getTotalAmount() + (newAmount - oldAmount))
                existingProduct.props.available -= (count - existingItem.getCount())
            }
        await productRepo.save(existingProduct)

        const newItem = new CartItem({
            cartId: existingItem.getCartId(),
            count: count || existingItem.getCount(),
            probaId: proba_id || existingItem.getProbaId(),
            decorateId: decorate_id || existingItem.getDecorateId(),
            sizeId: size_id || existingItem.getSizeId(),
            productId: existingProduct ? existingProduct.getId() : existingItem.getProductId(),
            updatedAt: new Date(),
            createdAt: existingItem.getCreatedAt()
        }, existingItem.getId())

        const result = await itemCartRepo.save(newItem)

        if(result) {
            await cartRepo.save(existingCart)
        }
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function deleteItemCartController(request: FastifyRequest<ItemCartRequest>, reply: FastifyReply) {
    try {
        const { id } = request.query as ItemCartRequest['Query'];
        const delData = new DeleteItemCart(itemCartRepo);
        const getProduct = new GetByIdProducts(productRepo)
        const getCart = new GetByIDCart(cartRepo)
        const getDiscount = new GetByProductIdDiscount(discountRepo)

        const data = await delData.execute({ id });
        const existingProduct = await getProduct.execute({ id: data.getProductId() })
        const existingCart = await getCart.execute({id: data.getCartId()})

        let discountProduct: any;
        try {
            discountProduct = await getDiscount.execute({product_id: data.getProductId()})
        } catch (error: any) {
            console.log(error)
        }

        existingCart.props.totalAmount -= ((existingProduct.getPrice() * data.getCount()) - (((existingProduct.getPrice() * data.getCount()) / 100) * (discountProduct ? (100 - discountProduct.getPercentage()) : 0)))
        existingProduct.props.available += data.getCount()

        await cartRepo.save(existingCart)
        await productRepo.save(existingProduct)

        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

