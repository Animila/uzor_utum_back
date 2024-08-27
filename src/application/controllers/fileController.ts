import {FastifyReply, FastifyRequest} from "fastify";
import LoadFile from "../../useCases/file/fileLoad";
import {PrismaFileRepo} from "../../infrastructure/prisma/repo/PrismaFileRepo";
import {FileMap} from "../../mappers/FileMap";
import {GetAllFile} from "../../useCases/file/fileGetAll";
import {DeleteFile} from "../../useCases/file/fileDelete";
import {GetByIdFile} from "../../useCases/file/fileGetById";

const repoFile = new PrismaFileRepo()
export async function createFile(request: FastifyRequest<FileRouting>, reply: FastifyReply) {
    try {
        const data = request.body
        const loadFile = new LoadFile(repoFile)

        console.log(data)

//@ts-ignore
        const result = await loadFile.execute({file: data.file, entity_id: data.entity_id.value, entity_type: data.entity_type.value, position: parseInt(data.position.value)})
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

export async function updateFile(request: FastifyRequest<FileRouting>, reply: FastifyReply) {
    try {
        const {position} =  request.body
        const {id} =  request.params
        const getFile = new GetByIdFile(repoFile)
        const result = await getFile.execute({id: id})

        result.props.position = position

        await repoFile.save(result)

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
        const data = request.query as FileRouting['Query']
        const {entity_id, entity_type} = request.params
        const loadFile = new GetAllFile(repoFile)
        const result = await loadFile.execute({entity_type, entity_id, offset: data.offset ? parseInt(data.offset) : undefined, limit: data.limit ? parseInt(data.limit) : undefined})
        reply.status(200).send({
            success: true,
            data: result.data,
            pagination: {
                totalItems: result.count,
                totalPages: Math.ceil(result.count / (data.limit ? parseInt(data.limit) : 10)),
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
