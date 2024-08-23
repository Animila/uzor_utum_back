import {IFileRepo} from "../../repositories/IFileRepository";
import { File } from "../../domain/file/file";

interface GetByIdFileInput {
    id: string
}

export class GetByIdFile {
    private repository: IFileRepo;

    constructor(repository: IFileRepo) {
        this.repository = repository;
    }

    async execute(input: GetByIdFileInput): Promise<File> {
        const { id } = input;

        const existingData = await this.repository.getById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Файлы не найдены'
            }))
        }
        return existingData

    }
}
