import {IFileRepo} from "../../repositories/IFileRepository";
import {Guard} from "../../domain/guard";
import {PathSharp} from "../../infrastructure/local/PathSharp";

interface DeleteFileInput {
    id: string
}

export class DeleteFile {
    private repository: IFileRepo;
    private localFile

    constructor(repository: IFileRepo) {
        this.repository = repository;
        this.localFile = new PathSharp(this.repository)
    }

    async execute(input: DeleteFileInput): Promise<boolean> {
        const { id } = input;

        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'id',
                        message: 'Нет id'
                    }
                ]
            }))
        const existingFile = await this.repository.getById(id)
        if(!existingFile) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Файл не найден'
            }))
        }
        await this.localFile.delete(existingFile.getPath())
        return await this.repository.delete(existingFile.getId())

    }
}