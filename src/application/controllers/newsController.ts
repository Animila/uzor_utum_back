import {FastifyReply, FastifyRequest} from "fastify";
import {PrismaNewsRepo} from "../../infrastructure/prisma/repo/PrismaNewsRepo";
import {NewsMap} from "../../mappers/NewsMap";
import {CreateNews} from "../../useCases/news/newsCreate";
import {GetAllNews} from "../../useCases/news/newsGetAll";
import {GetByIdNews} from "../../useCases/news/newsGetById";
import {UpdateNews} from "../../useCases/news/newsUpdate";
import {DeleteNews} from "../../useCases/news/newsDelete";
import {AddViewNews} from "../../useCases/news/newsAddView";
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {News} from "../../domain/news/news";
import {redis} from "../../infrastructure/redis/redis";

const repo = new PrismaNewsRepo()
const fileRepo = new PrismaFileRepo();

export async function createNewsController(request: FastifyRequest<NewsRequest>, reply: FastifyReply) {
    const data = request.body;

    try {
        const createData = new CreateNews(repo)
        const result = await createData.execute({
            title: data.title,
            about: data.about,
            text: data.text,
            views: data.views,
            journal_id: data.journal_id
        })
        await redis.flushdb()
        return reply.status(201).send({
            success: true,
            data: NewsMap.toPersistence(result)
        })
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
        return
    }
}

export async function addViewNewsController(request: FastifyRequest<NewsRequest>, reply: FastifyReply) {
    const {id} = request.params;
    try {
        const getData = new AddViewNews(repo)
        const result = await getData.execute({id})
        await redis.flushdb()
        return reply.status(201).send({
            success: true,
        })
    } catch (error: any) {
        console.log('Error:', error.message);
        const errors = JSON.parse(error.message);
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        });
        return
    }
}

export async function getAllNewsController(request: FastifyRequest<NewsRequest>, reply: FastifyReply) {
    try {
        const {old, popular, journalId, limit, offset, q} = request.query as NewsRequest['Query']
        const cacheKey = `news:${old}:${popular}:${journalId}:${limit}:${offset}`;
        let newsRes: {
            data: any,
            pagination: any
        }

        //@ts-ignore
        let newsCache = await redis.get(cacheKey);

        if (!newsCache) {
            const getAllData = new GetAllNews(repo)
            const resultAll = await getAllData.execute({offset: !!offset ? parseInt(offset) : 0,limit: !!limit ? parseInt(limit) : 10, journal_id: journalId, old: old === 'true', popular: popular === 'true', search: q});

            const getFiles = new GetAllFile(fileRepo)

            await Promise.all(resultAll.data.map(async (dataPer) => {
                const data = await getFiles.execute({limit: 10, offset: 0, entity_type: 'news', entity_id: dataPer.id});
                dataPer.images = data.data
            }))
            newsRes = {
                data: resultAll.data,
                pagination: {
                    totalItems: resultAll.count,
                    totalPages: Math.ceil(resultAll.count / (!!limit ? parseInt(limit) : 10)),
                    currentPage: (!!offset ? parseInt(offset) : 0) + 1,
                    limit: !!limit ? parseInt(limit) : 10
                }
            }
            await redis.set(cacheKey, JSON.stringify(newsRes), 'EX', 3600);
        } else {
            newsRes = JSON.parse(newsCache)
        }

        reply.status(200).send({
            success: true,
            data: newsRes.data,
            pagination: newsRes.pagination

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

export async function getByIdNewsController(request: FastifyRequest<NewsRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const cacheKey = `news:${id}`;
        let newsRes;

        //@ts-ignore
        let newsCache = await redis.get(cacheKey);

        if (!newsCache) {
            const getData = new GetByIdNews(repo, fileRepo);
            const data = await getData.execute({id});
            newsRes = NewsMap.toPersistence(data)
            await redis.set(cacheKey, JSON.stringify(newsRes), 'EX', 3600);
        } else {
            newsRes = JSON.parse(newsCache)
        }

        reply.status(200).send({
            success: true,
            data: newsRes
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

export async function updateNewsController(request: FastifyRequest<NewsRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const data = request.body || {};
        const updateNews = new UpdateNews(repo);

        const product = await updateNews.execute({
            id: id,
            title: data.title,
            about: data.about,
            text: data.text,
            views: data.views,
            journal_id: data.journal_id
        });

        const dataPer = NewsMap.toPersistence(product)

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: dataPer
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

export async function deleteNewsController(request: FastifyRequest<NewsRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const deleteData = new DeleteNews(repo);
        const data = await deleteData.execute({ id });

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
