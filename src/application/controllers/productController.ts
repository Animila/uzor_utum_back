import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import fastify, {FastifyReply, FastifyRequest} from "fastify";
import {ProductMap} from "../../mappers/ProductMap";
import {CreateProduct} from "../../useCases/product/productCreate";
import {PrismaCategoryRepo} from "../../infrastructure/prisma/repo/PrismaCategoryRepo";
import {PrismaMaterialRepo} from "../../infrastructure/prisma/repo/PrismaMaterialRepo";
import {GetByIdCategory} from "../../useCases/product/category";
import {GetByIdMaterial} from "../../useCases/product/material";
import {GetAllProducts} from "../../useCases/product/productGetAll";
import {GetByIdProducts} from "../../useCases/product/productGetById";
import {UpdateProduct} from "../../useCases/product/productUpdate";
import {DeleteProduct} from "../../useCases/product/productDelete";
import {PrismaDiscountRepo} from "../../infrastructure/prisma/repo/PrismaDiscountRepo";
import {GetByProductIdDiscount} from "../../useCases/discount/discountGetByProductId";
import {DiscountMap} from "../../mappers/DiscountMap";
import {PrismaProbRepo} from "../../infrastructure/prisma/repo/PrismaProbRepo";
import {PrismaSizeRepo} from "../../infrastructure/prisma/repo/PrismaSizeRepo";
import {PrismaDecorateRepo} from "../../infrastructure/prisma/repo/PrismaDecorateRepo";
import {GetByIdProb} from "../../useCases/product/probs";
import {GetByIdSize} from "../../useCases/product/size";
import {GetByIdDecorate} from "../../useCases/product/decorate";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {PrismaReviewRepo} from "../../infrastructure/prisma/repo/PrismaReviewRepo";
import {redis} from "../../infrastructure/redis/redis";

const productRepo = new PrismaProductRepo();
const categoryRepo = new PrismaCategoryRepo();
const materialRepo = new PrismaMaterialRepo();
const discountRepo = new PrismaDiscountRepo();
const probRepo = new PrismaProbRepo()
const sizeRepo = new PrismaSizeRepo()
const decorRepo = new PrismaDecorateRepo()
const fileRepo = new PrismaFileRepo()


export async function createProductController(request: FastifyRequest<ProductRequest>, reply: FastifyReply) {
    const data = request.body;

    const getCategory = new GetByIdCategory(categoryRepo)
    const getMaterial = new GetByIdMaterial(materialRepo)
    const getProba = new GetByIdProb(probRepo)
    const getSize = new GetByIdSize(sizeRepo)
    const getDecor = new GetByIdDecorate(decorRepo)

    try {
        await getCategory.execute({id: data.category_id})
    } catch (error) {
        console.log()
        reply.status(400).send({
            success: false,
            message: [
                {
                    type: 'category_id',
                    message: 'Категория не выбрана или не найдена'
                }
            ]
        });
    }

    try {
        await getMaterial.execute({id: data.material_id})
    } catch (error) {
        console.log()
        reply.status(400).send({
            success: false,
            message: [
                {
                    type: 'material_id',
                    message: 'Материал не выбран или не найден'
                }
            ]
        });
    }

    try {

        for (const item of data.prob_ids) {
            await getProba.execute({id: item});
        }
        for (const item of data.size_ids) {
            await getSize.execute({id: item});
        }
        for (const item of data.decoration_ids) {
            await getDecor.execute({id: item});
        }


    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
        return
    }


    try {
        if(data.available <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'available',
                        message: 'Не должно быть меньше или равно нулю'
                    }
                ]
            }))

        if(data.price <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'price',
                        message: 'Не должно быть меньше или равно нулю'
                    }
                ]
            }))


        if(data.description.length <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'description',
                        message: 'Не должно быть пустым'
                    }
                ]
            }))

        if(data.details.length <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'details',
                        message: 'Не должно быть пустым'
                    }
                ]
            }))

        if(data.delivery.length <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'delivery',
                        message: 'Не должно быть пустым'
                    }
                ]
            }))


        if(data.title.length <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'title',
                        message: 'Не должно быть пустым'
                    }
                ]
            }))

        if(data.article.length <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'article',
                        message: 'Не должно быть пустым'
                    }
                ]
            }))

        const createProduct = new CreateProduct(productRepo, fileRepo);
        const product = await createProduct.execute(data);
        await redis.flushdb()
        reply.status(201).send({
            success: true,
            data: ProductMap.toPersistence(product)
        });
    } catch (error: any) {

        const errors = JSON.parse(error.message);
        console.log({
            success: false,
            message: errors.message
        })
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
    }
}

export async function getAllProductController(request: FastifyRequest<ProductRequest>, reply: FastifyReply) {
    try {
        const {
            sizeIds,
            decorationIds,
            probIds,
            sortBy,
            order,
            categoryId,
            materialId,
            q ,
            minPrice,
            sex,
            maxPrice,
            limit = "10",
            offset = "0",
            discount_at
        } = request.query as ProductRequest['Query'];

        let productsRes: {
            data: {
                id: string,
                title: string,
                article: string,
                price: number,
                images?: any
                sex: string,
                description: string,
                details: string,
                delivery: string,
                prob_ids: string[];
                discount_at?: boolean,
                decoration_ids: string[];
                size_ids: string[];
                discount?: any,
                available: number,
                category_id: string,
                material_id: string,
                created_at: Date,
                updated_at: Date,
                review?: any
            }[],
            pagination: any
        }

        const cacheKey = `products:${categoryId}:${materialId}:${sizeIds}:${decorationIds}:${probIds}:${sortBy}:${order}:${q}:${minPrice}:${sex}:${maxPrice}:${limit}:${offset}:${discount_at}`;

        //@ts-ignore
        let productsCache = await redis.get(cacheKey);

        if (!productsCache) {
            const minPriceInt = minPrice ? parseInt(minPrice) : undefined
            const maxPriceInt = maxPrice ? parseInt(maxPrice) : undefined
            const decorIdsArray = decorationIds ? decorationIds[0].split(',') : undefined;
            const sizeIdsArray = sizeIds ? sizeIds[0].split(',') : undefined;
            const probIdsArray = probIds ? probIds[0].split(',') : undefined;
            const getAllProduct = new GetAllProducts(productRepo, fileRepo);
            const getDiscount = new GetByProductIdDiscount(discountRepo)
            const products = await getAllProduct.execute({
                categoryId,
                materialId,
                sizeIds: sizeIdsArray,
                decorationIds: decorIdsArray,
                discount_at: discount_at,
                probIds: probIdsArray,
                sortBy,
                order,
                search: q,
                maxPrice: maxPriceInt,
                minPrice: minPriceInt,
                sex: sex,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
            const getReview = new PrismaReviewRepo()

            const productsWithDiscount = await Promise.all(products.data.map(async (product) => {
                try {
                    const discountResult = await getDiscount.execute({ product_id: product.id });
                    product.discount = DiscountMap.toPersistence(discountResult);
                    const resReview = await getReview.getReviewStats(product.id)
                    console.log(resReview)
                    product.review = resReview
                } catch (error) {
                    console.log(error);
                }
                return product;
            }));

            // Кэширование результата

            // @ts-ignore
            productsRes = {
                data: productsWithDiscount,
                pagination: {
                    totalItems: products.count,
                    totalPages: Math.ceil(products.count / (limit ? parseInt(limit) : 10)),
                    currentPage: (offset ? parseInt(offset) : 0) + 1,
                    limit: limit ? parseInt(limit) : 10
                }
            }
            //@ts-ignore
            await redis.set(cacheKey, JSON.stringify(productsRes), 'EX', 3600); // Время жизни кэша в секундах
        } else {
            productsRes = JSON.parse(productsCache);
        }

        console.log(productsRes)

        reply.status(200).send({
            success: true,
            data: productsRes.data,
            pagination: productsRes.pagination

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

export async function getByIdProductController(request: FastifyRequest<ProductRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const cacheKey = `product:${id}`;

        //@ts-ignore
        let productCache = await redis.get(cacheKey);
        let productRes;

        if (!productCache) {
            const getProduct = new GetByIdProducts(productRepo, fileRepo);
            const product = await getProduct.execute({ id });
            const getDiscount = new GetByProductIdDiscount(discountRepo)
            const productPer = ProductMap.toPersistence(product)
            const getFiles = new GetAllFile(fileRepo)
            const getReview = new PrismaReviewRepo()
            try {
                const result = await getDiscount.execute({product_id: product.getId()})
                productPer.discount = DiscountMap.toPersistence(result)
            } catch (err) {}
            const dataFile = await getFiles.execute({entity_id: product.getId(), entity_type: 'product'})
            productPer.images = dataFile.data
            const resReview = await getReview.getReviewStats(productPer.id)
            console.log(resReview)
            productPer.review = resReview
            productRes = productPer
            await redis.set(cacheKey, JSON.stringify(productRes), 'EX', 3600); // Время жизни кэша в секундах
        } else {
            productRes = JSON.parse(productCache)
        }
        reply.status(200).send({
            success: true,
            data: productRes
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

export async function updateProductController(request: FastifyRequest<ProductRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const data = request.body || {};

        if(data.available <= 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'available',
                        message: 'Не должно быть меньше или равно нулю'
                    }
                ]
            }))

        const updateProduct = new UpdateProduct(productRepo, fileRepo);
        const product = await updateProduct.execute({
            id: id,
            title: data.title,
            article: data.article,
            price: data.price,
            sex: data.sex,
            description: data.description,
            details: data.details,
            delivery: data.delivery,
            available: data.available,
            categoryId: data.category_id,
            materialId: data.material_id,
            sizeIds: data.size_ids,
            probIds: data.prob_ids,
            decorationIds: data.decoration_ids
        });

        const productPer = ProductMap.toPersistence(product)
        const getFiles = new GetAllFile(fileRepo)
        const dataFile = await getFiles.execute({entity_id: product.getId(), entity_type: 'product'})
        productPer.images = dataFile.data
        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: productPer
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

export async function deleteProductController(request: FastifyRequest<ProductRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const delProduct = new DeleteProduct(productRepo);
        const data = await delProduct.execute({ id });

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
