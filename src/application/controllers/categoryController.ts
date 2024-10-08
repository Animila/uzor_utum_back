import {PrismaCategoryRepo} from "../../infrastructure/prisma/repo/PrismaCategoryRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {
    CreateCategory,
    DeleteCategory,
    GetAllCategory,
    GetByIdCategory,
    UpdateCategory
} from "../../useCases/product/category";
import {CategoryMap} from "../../mappers/CategoryMap";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {redis} from "../../infrastructure/redis/redis";

const categoryRepo = new PrismaCategoryRepo();
const fileRepo = new PrismaFileRepo();

export async function getAllCategoryController(request: FastifyRequest<CategoryRequest>, reply: FastifyReply) {
    try {
        const data = request.query as CategoryRequest['Query']

        const cacheKey = `categories:${data.limit}:${data.offset}`;
        let categoriesRes: {
            data: {
                id: string,
                title: string,
                images?: any
            }[],
            pagination: any
        }

        //@ts-ignore
        let categoriesCache = await redis.get(cacheKey);

        if (!categoriesCache) {
            const getAllCategory = new GetAllCategory(categoryRepo)
            const categories = await getAllCategory.execute(data.limit ? parseInt(data.limit) : undefined, data.offset ? parseInt(data.offset) : undefined);
            const getFiles = new GetAllFile(fileRepo)
            for (const category of categories.data) {
                const res = await getFiles.execute({
                    limit: 10,
                    offset: 0,
                    entity_id: category.id,
                    entity_type: 'category'
                })
                category.images = res.data
            }

            categoriesRes = {
                data: categories.data,
                pagination: {
                    totalItems: categories.count,
                    totalPages: Math.ceil(categories.count / (data.limit ? parseInt(data.limit) : 10)),
                    currentPage: (data.offset ? parseInt(data.offset) : 0) + 1,
                    limit: data.limit ? parseInt(data.limit) : 10
                }

            }

            await redis.set(cacheKey, JSON.stringify(categoriesRes), 'EX', 3600);
        } else {
            categoriesRes = JSON.parse(categoriesCache);
        }

        reply.status(200).send({
            success: true,
            data: categoriesRes.data,
            pagination: categoriesRes.pagination
        });
    } catch (error: any) {
        console.log('categoryControllerGetAll: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function getByIdCategoryController(request: FastifyRequest<CategoryRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const cacheKey = `category:${id}`;
        let categoryRes;

        //@ts-ignore
        let categoryCache = await redis.get(cacheKey);

        if (!categoryCache) {
            const getCategory = new GetByIdCategory(categoryRepo)
            const category = await getCategory.execute({id: id});
            const categoryPer = CategoryMap.toPersistence(category)
            const getFiles = new GetAllFile(fileRepo)
            const data = await getFiles.execute({entity_id: category.getId(), entity_type: 'category'})
            categoryPer.images = data.data

            categoryRes = categoryPer
            await redis.set(cacheKey, JSON.stringify(categoryRes), 'EX', 3600);
        } else {
            categoryRes = JSON.parse(categoryCache)
        }
        reply.status(200).send({
            success: true,
            data: categoryRes
        });
    } catch (error: any) {
        console.log('categoryControllerGetId: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}


export async function createCategoryController(request: FastifyRequest<CategoryRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createCategory = new CreateCategory(categoryRepo)
        const result =  await createCategory.execute({title: data.title!});
        await redis.flushdb()

        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
            }
        });

    } catch (error: any) {
        console.log('categoryControllerCreate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function updateCategoryController(request: FastifyRequest<CategoryRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateCategory = new UpdateCategory(categoryRepo)
        const category = await updateCategory.execute({
            id: id,
            title: data.title
        });
        const categoryPer = CategoryMap.toPersistence(category)
        const getFiles = new GetAllFile(fileRepo)
        const dataFile = await getFiles.execute({entity_id: category.getId(), entity_type: 'category'})
        categoryPer.images = dataFile.data
        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: categoryPer
        });
    } catch (error: any) {
        console.log('categoryControllerUpdate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function deleteCategoryController(request: FastifyRequest<CategoryRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delCategory = new DeleteCategory(categoryRepo)
        const data = await delCategory.execute({id: id})

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('categoryControllerDelete: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
