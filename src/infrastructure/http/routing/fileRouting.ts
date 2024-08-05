import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Roles} from "../../../domain/user/valueObjects/role";
import {getFilesSchema, loadFileSchema} from "../schemas/fileSchemas";
import {createFile, deleteFile, getFiles} from "../../../application/controllers/fileController";

export function registerFileRouting(fastify: FastifyInstance) {
    fastify.post('/file/upload',loadFileSchema, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
        // await req.jwtVerify()
        await createFile(req, res)
    });
    fastify.post('/file/:entity_type/:entity_id', getFilesSchema, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
        await getFiles(req, res)
    });
    fastify.post('/file/:id',loadFileSchema, async (req: FastifyRequest<FileRouting>, res: FastifyReply) => {
        await deleteFile(req, res)
    });
}
