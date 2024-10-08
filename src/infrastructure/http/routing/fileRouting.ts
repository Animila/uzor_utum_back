import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {deleteFileSchema, getFilesSchema, loadFileSchema, updateFileSchema} from "../schemas/fileSchemas";
import {createFile, deleteFile, getFiles, updateFile} from "../../../application/controllers/fileController";
import {createWriteStream} from "node:fs";
import path from "path";
import {hide} from "concurrently/dist/src/defaults";

export function registerFileRouting(fastify: FastifyInstance) {
    //@ts-ignore
    fastify.post('/file/upload', {schema: {hide: true}}, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
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
