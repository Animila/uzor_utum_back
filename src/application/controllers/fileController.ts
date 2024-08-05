import {FastifyReply, FastifyRequest} from "fastify";
import LoadFile from "../../useCases/file/fileLoad";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {FileMap} from "../../mappers/FileMap";
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {DeleteFile} from "../../useCases/file/fileDelete";

const repoFile = new PrismaFileRepo()
export async function createFile(request: FastifyRequest<FileRouting>, reply: FastifyReply) {
    try {
        const file =  request.body.files
        const {entity_id, entity_type} = request.body
        console.log(file)
        const loadFile = new LoadFile(repoFile)
        const result = await loadFile.execute({file:file, entity_id: entity_id, entity_type: entity_type})
        reply.status(200).send({
            success: true,
            data: FileMap.toPersistence(result)
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

export async function getFiles(request: FastifyRequest<FileRouting>, reply: FastifyReply) {
    try {
        const {entity_id, entity_type} = request.params
        const loadFile = new GetAllFile(repoFile)
        const result = await loadFile.execute({entity_type, entity_id})
        reply.status(200).send({
            success: true,
            data: result
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

export async function deleteFile(request: FastifyRequest<FileRouting>, reply: FastifyReply) {
    try {
        const {id} = request.params
        const delFile = new DeleteFile(repoFile)
        const result = await delFile.execute({id})
        reply.status(200).send({
            success: true,
            data: result
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