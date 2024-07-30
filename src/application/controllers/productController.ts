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

const productRepo = new PrismaProductRepo();
const categoryRepo = new PrismaCategoryRepo();
const materialRepo = new PrismaMaterialRepo();
const discountRepo = new PrismaDiscountRepo();


export async function createProductController(request: FastifyRequest<ProductRequest>, reply: FastifyReply) {
    const data = request.body;

    try {
        const getCategory = new GetByIdCategory(categoryRepo)
        const getMaterial = new GetByIdMaterial(materialRepo)
        await getCategory.execute({id: data.category_id})
        await getMaterial.execute({id: data.material_id})
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
        const createProduct = new CreateProduct(productRepo);
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
            maxPrice
        } = request.query as ProductRequest['Query'];
        const minPriceInt = minPrice ? parseInt(minPrice) : undefined
        const maxPriceInt = maxPrice ? parseInt(maxPrice) : undefined
        const getAllProduct = new GetAllProducts(productRepo);
        const getDiscount = new GetByProductIdDiscount(discountRepo)
        const products = await getAllProduct.execute({categoryId, materialId, sizeIds, decorationIds, probIds, sortBy, order, search: q, maxPrice: maxPriceInt, minPrice: minPriceInt});
        await Promise.all(
            products.map(async item => {
                try {
                    const result = await getDiscount.execute({ product_id: item.id });
                    item.discount = DiscountMap.toPersistence(result);
                } catch (error) {

                }
            })
        )
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
        const getProduct = new GetByIdProducts(productRepo);
        const product = await getProduct.execute({ id });
        const getDiscount = new GetByProductIdDiscount(discountRepo)
        const productPer = ProductMap.toPersistence(product)
        try {
            const result = await getDiscount.execute({product_id: product.getId()})
            productPer.discount = DiscountMap.toPersistence(result)
        } catch (err) {}
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
        const updateProduct = new UpdateProduct(productRepo);
        const product = await updateProduct.execute({
            id: id,
            title: data.title,
            article: data.article,
            price: data.price,
            pathImages: data.path_images,
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

        reply.status(200).send({
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
