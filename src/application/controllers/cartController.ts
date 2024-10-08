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
import {ProductMap} from "../../mappers/ProductMap";
import {GetByIdMaterial} from "../../useCases/product/material";
import {PrismaMaterialRepo} from "../../infrastructure/prisma/repo/PrismaMaterialRepo";
import {PrismaSizeRepo} from "../../infrastructure/prisma/repo/PrismaSizeRepo";
import {PrismaDecorateRepo} from "../../infrastructure/prisma/repo/PrismaDecorateRepo";
import {PrismaProbRepo} from "../../infrastructure/prisma/repo/PrismaProbRepo";
import {GetByIdSize} from "../../useCases/product/size";
import {GetByIdProb} from "../../useCases/product/probs";
import {GetByIdDecorate} from "../../useCases/product/decorate";
import {SizeMap} from "../../mappers/SizeMap";
import {DecorateMap} from "../../mappers/DecorateMap";
import {ProbMap} from "../../mappers/ProbMap";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {DiscountMap} from "../../mappers/DiscountMap";
import {redis} from "../../infrastructure/redis/redis";
import {Roles} from "../../domain/user/valueObjects/role";

const cartRepo = new PrismaCartRepository()
const userRepo = new PrismaUserRepo()
const itemCartRepo = new PrismaItemCartRepository()
const productRepo = new PrismaProductRepo()
const discountRepo = new PrismaDiscountRepo()
const materRepo = new PrismaMaterialRepo()
const sizeRepo = new PrismaSizeRepo()
const decorateRepo = new PrismaDecorateRepo()
const probRepo = new PrismaProbRepo()
const fileRepo = new PrismaFileRepo()

export async function checkCartController(request: FastifyRequest<CartRequest>, reply: FastifyReply) {
    try {
        const {user_id, token, limit, offset} = request.query as CartRequest['Query']
        const checkUser = Guard.againstNullOrUndefined(user_id, 'user_id')
        if(checkUser.succeeded) {
            await request.jwtVerify()
            //@ts-ignore
            if(request.user.data.role !== Roles.admin && request.user.data.user_id !== user_id) return reply.status(403).send('Not authorized')

            var getUser = new GetUserById(userRepo)
            await getUser.execute({user_id: user_id})
        }

        const checkData = new CheckCart(cartRepo)
        const result = await checkData.execute({user_id, token})
        const cartRep = CartMap.toPersistence(result)

        const getItems = new GetItemsCart(itemCartRepo)
        const data = await getItems.execute({limit: !!limit ? parseInt(limit) : 10, offset: !!offset ? parseInt(offset) : 0, cart_id: result.getId()})

        const getProduct = new GetByIdProducts(productRepo, fileRepo)
        const getDiscount = new GetByProductIdDiscount(discountRepo)

        result.props.totalAmount = 0
        cartRep.items = await Promise.all(data.data.map(async (item, index) => {
            let existingProduct, discountProduct
            try {
                existingProduct = await getProduct.execute({id: item.getProductId()})
                discountProduct = await getDiscount.execute({ product_id: existingProduct.getId() })
            } catch (e) {
                console.log(e)
            }
            const priceWithDiscount = existingProduct ? existingProduct.getPrice() * (discountProduct ? (100 - discountProduct.getPercentage()) / 100 : 1) : 0

            result.props.totalAmount += Math.floor(priceWithDiscount * item.getCount())


            const itemPer = ItemCartMap.toPersistence(item)
            itemPer.product = existingProduct ? ProductMap.toPersistence(existingProduct) : undefined
            itemPer.product.discount = discountProduct ? DiscountMap.toPersistence(discountProduct) : undefined

            try {
                const getSize = new GetByIdSize(sizeRepo)
                const getProb = new GetByIdProb(probRepo)
                const getDecor = new GetByIdDecorate(decorateRepo)

                itemPer.size = itemPer.size_id ? SizeMap.toPersistence(await getSize.execute({id: itemPer.size_id})) : undefined
                itemPer.decorate = itemPer.decorate_id ? DecorateMap.toPersistence(await getDecor.execute({id: itemPer.decorate_id})) : undefined
                itemPer.proba = itemPer.proba_id ? ProbMap.toPersistence(await getProb.execute({id: itemPer.proba_id})) : undefined
            } catch (e) {
                console.log(e)
            }

            return itemPer
        }))
        await cartRepo.save(result)
        cartRep.total_amount = result.props.totalAmount

        reply.status(201).send({
            success: true,
            data: cartRep,
            pagination: {
                totalItems: data.count,
                totalPages: Math.ceil(data.count / (!!limit ?parseInt(limit) : 10)),
                currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                limit: !!limit ? parseInt(limit) : 10
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

        const getProduct = new GetByIdProducts(productRepo, fileRepo)
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
        await redis.flushdb()

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
        const {count, decorate_id, size_id, proba_id} = request.body
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
        const getProduct = new GetByIdProducts(productRepo, fileRepo)
        const getCart = new GetByIDCart(cartRepo)
        const getDiscount = new GetByProductIdDiscount(discountRepo)

        const existingItem = await getData.execute({id})
        console.log('222 ', existingItem)
        const existingProduct = await getProduct.execute({id: existingItem.getProductId()})
        console.log('222 ', existingProduct)
        const existingCart = await getCart.execute({id: existingItem.getCartId()})
        console.log('222 ', existingCart)

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
            const res = await getDiscount.execute({product_id: existingItem.getProductId()})

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
        await redis.flushdb()

        reply.send({
            success: true,
            data: newItem
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

export async function deleteItemCartController(request: FastifyRequest<ItemCartRequest>, reply: FastifyReply) {
    try {
        const { id } = request.query as ItemCartRequest['Query'];
        const delData = new DeleteItemCart(itemCartRepo);
        const getProduct = new GetByIdProducts(productRepo, fileRepo)
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
        await redis.flushdb()

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

