import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {deleteFileSchema, getFilesSchema, loadFileSchema, updateFileSchema} from "../schemas/fileSchemas";
import {createFile, deleteFile, getFiles, updateFile} from "../../../application/controllers/fileController";

export function registerFileRouting(fastify: FastifyInstance) {
    fastify.post('/file/upload',loadFileSchema, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
        if(req.body.entity_type !== 'review')
            await req.jwtVerify()
        await createFile(req, res)
    });
    fastify.put('/file/:id',updateFileSchema, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
        await req.jwtVerify()
        await updateFile(req, res)
    });
    fastify.get('/file/:entity_type/:entity_id', getFilesSchema, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
        await getFiles(req, res)
    });
    fastify.delete('/file/:id',deleteFileSchema, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
        await req.jwtVerify()
        await deleteFile(req, res)
    });
}
