import {PrismaProbRepo} from "../../infrastructure/prisma/repo/PrismaProbRepo";
import {FastifyReply, FastifyRequest} from "fastify";
import {
    CreateProb,
    DeleteProb,
    GetAllProb,
    GetByIdProb,
    UpdateProb
} from "../../useCases/product/probs";
import {ProbMap} from "../../mappers/ProbMap";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {redis} from "../../infrastructure/redis/redis";

const materialRepo = new PrismaProbRepo();
const fileRepo = new PrismaFileRepo();

export async function getAllProbController(request: FastifyRequest<ProbRequest>, reply: FastifyReply) {
    try {
        const data = request.query as ProbRequest['Query']
        const cacheKey = `probs:${data.limit}:${data.offset}`;
        let probsRes;

        //@ts-ignore
        let probsCache = await redis.get(cacheKey);

        if (!probsCache) {
            const getAllProb = new GetAllProb(materialRepo)
            const probs =  await getAllProb.execute(data.limit ? parseInt(data.limit) : undefined, data.offset ? parseInt(data.offset) : undefined);
            const getFiles = new GetAllFile(fileRepo)
            for(const proba of probs.data) {
                const data = await getFiles.execute({limit: 10, offset: 0, entity_id: proba.id, entity_type: 'proba'})
                proba.images = data.data
            }
            probsRes = {
                data: probs.data,
                pagination: {
                    totalItems: probs.count,
                    totalPages: Math.ceil(probs.count / (data.limit ? parseInt(data.limit) : 10)),
                    currentPage: (data.offset ? parseInt(data.offset) : 0) + 1,
                    limit: data.limit ? parseInt(data.limit) : 10
                }
            }
            await redis.set(cacheKey, JSON.stringify(probsRes), 'EX', 3600);
        } else {
            probsRes = JSON.parse(probsCache)
        }

        reply.status(200).send({
            success: true,
            data: probsRes.data,
            pagination: probsRes.pagination
        });
    } catch (error: any) {
        console.log('probControllerGetAll: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function getByIdProbController(request: FastifyRequest<ProbRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const cacheKey = `prob:${id}`;
        let probRes;

        //@ts-ignore
        let probCache = await redis.get(cacheKey);

        if (!probCache) {
            const getProb = new GetByIdProb(materialRepo)
            const prob = await getProb.execute({id: id});
            const probPer = ProbMap.toPersistence(prob)
            const getFiles = new GetAllFile(fileRepo)
            const dataFile = await getFiles.execute({entity_type: 'proba', entity_id: prob.getId()})
            probPer.images = dataFile.data
            probRes = probPer
            await redis.set(cacheKey, JSON.stringify(probPer), 'EX', 3600);
        } else {
          probRes = JSON.parse(probCache)
        }
        reply.status(200).send({
            success: true,
            data: probRes
        });
    } catch (error: any) {
        console.log('probControllerGetId: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function createProbController(request: FastifyRequest<ProbRequest>, reply: FastifyReply) {
    try {
        const data = request.body;

        const createService = new CreateProb(materialRepo)
        const result =  await createService.execute({title: data.title!});

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
            }
        });
    } catch (error: any) {
        console.log('probControllerCreate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function updateProbController(request: FastifyRequest<ProbRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const data = request.body || {};
        const updateProb = new UpdateProb(materialRepo)
        const prob = await updateProb.execute({
            id: id,
            title: data.title
        });
        const probPer = ProbMap.toPersistence(prob)
        const getFiles = new GetAllFile(fileRepo)
        const dataFile = await getFiles.execute({entity_type: 'proba', entity_id: prob.getId()})
        probPer.images = dataFile.data
        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: probPer
        });
    } catch (error: any) {
        console.log('probControllerUpdate: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}

export async function deleteProbController(request: FastifyRequest<ProbRequest>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delProb = new DeleteProb(materialRepo)
        const data = await delProb.execute({id: id})

        await redis.flushdb()
        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('probControllerDelete: ', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
