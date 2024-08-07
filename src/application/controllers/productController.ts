import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import {FastifyReply, FastifyRequest} from "fastify";
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

    try {
        const getCategory = new GetByIdCategory(categoryRepo)
        const getMaterial = new GetByIdMaterial(materialRepo)
        const getProba = new GetByIdProb(probRepo)
        const getSize = new GetByIdSize(sizeRepo)
        const getDecor = new GetByIdDecorate(decorRepo)

        await getCategory.execute({id: data.category_id})
        await getMaterial.execute({id: data.material_id})

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
        const createProduct = new CreateProduct(productRepo, fileRepo);
        const product = await createProduct.execute(data);
        reply.status(201).send({
            success: true,
            data: ProductMap.toPersistence(product)
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
            maxPrice
        } = request.query as ProductRequest['Query'];
        const minPriceInt = minPrice ? parseInt(minPrice) : undefined
        const maxPriceInt = maxPrice ? parseInt(maxPrice) : undefined
        const decorIdsArray = decorationIds ? decorationIds[0].split(',') : undefined;
        const sizeIdsArray = sizeIds ? sizeIds[0].split(',') : undefined;
        const probIdsArray = probIds ? probIds[0].split(',') : undefined;
        const getAllProduct = new GetAllProducts(productRepo, fileRepo);
        const getDiscount = new GetByProductIdDiscount(discountRepo)
        const products = await getAllProduct.execute({categoryId, materialId, sizeIds: sizeIdsArray, decorationIds: decorIdsArray, probIds: probIdsArray, sortBy, order, search: q, maxPrice: maxPriceInt, minPrice: minPriceInt, sex: sex});

        for(const product of products) {
            try {
                const result = await getDiscount.execute({ product_id: product.id });
                product.discount = DiscountMap.toPersistence(result);
            } catch (error) {

            }
        }

        console.log(products)
        reply.status(200).send({
            success: true,
            data: products
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
        const getProduct = new GetByIdProducts(productRepo, fileRepo);
        const product = await getProduct.execute({ id });
        const getDiscount = new GetByProductIdDiscount(discountRepo)
        const productPer = ProductMap.toPersistence(product)
        const getFiles = new GetAllFile(fileRepo)
        try {
            const result = await getDiscount.execute({product_id: product.getId()})
            productPer.discount = DiscountMap.toPersistence(result)
        } catch (err) {}
        productPer.images = await getFiles.execute({entity_id: product.getId(), entity_type: 'product'})
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
        productPer.images = await getFiles.execute({entity_id: product.getId(), entity_type: 'product'})

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
