import {FastifyReply, FastifyRequest} from "fastify";
import {PrismaNewsRepo} from "../../infrastructure/prisma/repo/PrismaNewsRepo";
import {NewsMap} from "../../mappers/NewsMap";
import {CreateNews} from "../../useCases/news/newsCreate";
import {GetAllNews} from "../../useCases/news/newsGetAll";
import {GetByIdNews} from "../../useCases/news/newsGetById";
import {UpdateNews} from "../../useCases/news/newsUpdate";
import {DeleteNews} from "../../useCases/news/newsDelete";
import {AddViewNews} from "../../useCases/news/newsAddView";

const repo = new PrismaNewsRepo()
export async function createNewsController(request: FastifyRequest<NewsRequest>, reply: FastifyReply) {
    const data = request.body;

    try {
        const createData = new CreateNews(repo)
        const result = await createData.execute({
            title: data.title,
            about: data.about,
            text: data.text,
            preview_path: data.preview_path,
            views: data.views,
            journal_id: data.journal_id
        })
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
        const {old, popular, journalId, } = request.query as NewsRequest['Query'];
        const getAllData = new GetAllNews(repo)
        const resultAll = await getAllData.execute({journal_id: journalId, old: old === 'true', popular: popular === 'true'});
        console.log(resultAll)
        reply.status(200).send({
            success: true,
            data: resultAll
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
        const getData = new GetByIdNews(repo);
        const data = await getData.execute({ id });
        reply.status(200).send({
            success: true,
            data: data
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
            preview_path: data.preview_path,
            views: data.views,
            journal_id: data.journal_id
        });

        reply.status(200).send({
            success: true,
            data: NewsMap.toPersistence(product)
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
