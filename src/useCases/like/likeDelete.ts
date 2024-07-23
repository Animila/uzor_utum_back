import {ILikeRepository} from "../../repositories/ILikeRepository";

interface DeleteLikeInput {
    id: string,
}

export class DeleteLike {
    private repository: ILikeRepository;

    constructor(repository: ILikeRepository) {
        this.repository = repository;
    }

    async execute(input: DeleteLikeInput): Promise<boolean> {
        const { id } = input;
        return await this.repository.delete(id);
    }
}