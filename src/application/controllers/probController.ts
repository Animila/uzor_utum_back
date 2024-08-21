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

const materialRepo = new PrismaProbRepo();
const fileRepo = new PrismaFileRepo();

export async function getAllProbController(request: FastifyRequest<ProbRequest>, reply: FastifyReply) {
    try {
        const data = request.query as ProbRequest['Query']
        const getAllProb = new GetAllProb(materialRepo)
        const probs =  await getAllProb.execute(data.limit ? parseInt(data.limit) : undefined, data.offset ? parseInt(data.offset) : undefined);
        const getFiles = new GetAllFile(fileRepo)
        for(const proba of probs.data) {
            const data = await getFiles.execute({limit: 10, offset: 0, entity_id: proba.id, entity_type: 'proba'})
            proba.images = data.data
        }
        reply.status(200).send({
            success: true,
            data: probs.data,
            pagination: {
                totalItems: probs.count,
                totalPages: Math.ceil(probs.count / (data.limit ? parseInt(data.limit) : 10)),
                currentPage: (data.offset ? parseInt(data.offset) : 0) + 1,
                limit: data.limit ? parseInt(data.limit) : 10
            }
        });
    } catch (error: any) {
        console.log('345678', error.message)
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
        const getProb = new GetByIdProb(materialRepo)
        const prob =  await getProb.execute({id: id});
        const probPer = ProbMap.toPersistence(prob)
        const getFiles = new GetAllFile(fileRepo)
        probPer.images = await getFiles.execute({entity_type: 'proba', entity_id: prob.getId()})

        reply.status(200).send({
            success: true,
            data: probPer
        });
    } catch (error: any) {
        console.log('345678', error.message)
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

        reply.status(200).send({
            success: true,
            data: {
                id: result.getId(),
            }
        });
    } catch (error: any) {
        console.log('345678', error.message)
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
        probPer.images = await getFiles.execute({entity_type: 'proba', entity_id: prob.getId()})

        reply.status(200).send({
            success: true,
            data: probPer
        });
    } catch (error: any) {
        console.log('345678', error.message)
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

        reply.status(200).send({
            success: true,
            data: {
                success: data
            }
        });
    } catch (error: any) {
        console.log('345678', error.message)
        const errors = JSON.parse(error.message)
        reply.status(errors.status).send({
            success: false,
            message: errors.message
        })
    }
}
