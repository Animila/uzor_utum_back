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

const materialRepo = new PrismaProbRepo();

export async function getAllProbController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getAllProb = new GetAllProb(materialRepo)
        const results =  await getAllProb.execute();
        reply.status(200).send({
            success: true,
            data: results
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
        const material =  await getProb.execute({id: id});

        reply.status(200).send({
            success: true,
            data: ProbMap.toPersistence(material)
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
        const material = await updateProb.execute({
            id: id,
            title: data.title
        });

        reply.status(200).send({
            success: true,
            data: ProbMap.toPersistence(material)
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