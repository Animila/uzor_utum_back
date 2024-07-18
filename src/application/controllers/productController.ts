import {PrismaProductRepo} from "../../infrastructure/prisma/repo/PrismaProductRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {ProductMap} from "../../mappers/ProductMap";
import {CreateProduct} from "../../useCases/product/createProduct";
import {PrismaCategoryRepo} from "../../infrastructure/prisma/repo/PrismaCategoryRepo";
import {PrismaMaterialRepo} from "../../infrastructure/prisma/repo/PrismaMaterialRepo";
import {GetByIdCategory} from "../../useCases/product/category";
import {GetByIdMaterial} from "../../useCases/product/material";
import {GetAllProducts} from "../../useCases/product/getAllProducts";
import {GetByIdProducts} from "../../useCases/product/getByIdProducts";
import {UpdateProduct} from "../../useCases/product/updateProduct";
import {DeleteProduct} from "../../useCases/product/deleteProduct";

const productRepo = new PrismaProductRepo();
const categoryRepo = new PrismaCategoryRepo();
const materialRepo = new PrismaMaterialRepo();


export async function createProductController(request: FastifyRequest<ProductRequest>, reply: FastifyReply) {
    const data = request.body;

    try {
        const getCategory = new GetByIdCategory(categoryRepo)
        const getMaterial = new GetByIdMaterial(materialRepo)
        await getCategory.execute({id: data.categoryId})
        await getMaterial.execute({id: data.materialId})
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
            filters,
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
        const json = filters ? JSON.parse(filters!) : undefined
        const getAllProduct = new GetAllProducts(productRepo);
        const products = await getAllProduct.execute({categoryId, materialId, filters: json, sortBy, order, search: q, maxPrice: maxPriceInt, minPrice: minPriceInt});
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

        reply.status(200).send({
            success: true,
            data: product
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
            path_images: data.path_images,
            sex: data.sex,
            description: data.description,
            details: data.details,
            delivery: data.delivery,
            attributes: data.attributes,
            available: data.available,
            categoryId: data.categoryId,
            materialId: data.materialId
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
