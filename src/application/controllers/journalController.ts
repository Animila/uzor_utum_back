import {FastifyReply, FastifyRequest} from "fastify";
import {CreateJournal, DeleteJournal, GetAllJournal, GetByIdJournal, UpdateJournal} from "../../useCases/news/journal";
import {PrismaJournalRepo} from "../../infrastructure/prisma/repo/PrismaJournalRepo";
import {JournalMap} from "../../mappers/JournalMap";
import {redis} from "../../infrastructure/redis/redis";

const journalRepo = new PrismaJournalRepo()
export async function createJournalController(request: FastifyRequest<JournalRequest>, reply: FastifyReply) {
    const data = request.body;

    try {
        const createData = new CreateJournal(journalRepo)
        const result = await createData.execute({title: data.title})
        await redis.flushdb()
        return reply.status(201).send({
            success: true,
            data: JournalMap.toPersistence(result)
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

export async function getAllJournalController(request: FastifyRequest<JournalRequest>, reply: FastifyReply) {
    try {
        const {offset, limit} = request.query as JournalRequest['Query']
        const getAllData = new GetAllJournal(journalRepo)
        const resultAll = await getAllData.execute({offset: !!offset ? parseInt(offset) : 0, limit: !!limit ? parseInt(limit) : 10});
        reply.status(200).send({
            success: true,
            data: resultAll.data,
            pagination: {
                totalItems: resultAll.count,
                totalPages: Math.ceil(resultAll.count / (!!limit ? parseInt(limit) : 10)),
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

export async function getByIdJournalController(request: FastifyRequest<JournalRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const getData = new GetByIdJournal(journalRepo);
        const data = await getData.execute({ id });
        reply.status(200).send({
            success: true,
            data: JournalMap.toPersistence(data)
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

export async function updateJournalController(request: FastifyRequest<JournalRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const data = request.body || {};
        const updateJournal = new UpdateJournal(journalRepo);
        const product = await updateJournal.execute({
            id: id,
            title: data.title
        });

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: JournalMap.toPersistence(product)
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

export async function deleteJournalController(request: FastifyRequest<JournalRequest>, reply: FastifyReply) {
    try {
        const { id } = request.params;
        const deleteData = new DeleteJournal(journalRepo);
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
