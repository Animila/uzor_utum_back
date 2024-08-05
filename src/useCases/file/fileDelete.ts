import {IFileRepo} from "../../repositories/IFileRepository";
import {Guard} from "../../domain/guard";

interface DeleteFileInput {
    id: string
}

export class DeleteFile {
    private repository: IFileRepo;

    constructor(repository: IFileRepo) {
        this.repository = repository;
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

        return await this.repository.delete(id)

    }
}