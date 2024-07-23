import {INewsRepository} from "../../repositories/INewsRepository";
import {Guard} from "../../domain/guard";

interface DeleteNewsInput {
    id: string
}

export class DeleteNews {
    private repository: INewsRepository;

    constructor(repository: INewsRepository) {
        this.repository = repository;
    }

    async execute(input: DeleteNewsInput): Promise<boolean> {
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