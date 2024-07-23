import {ILikeRepository} from "../../repositories/ILikeRepository";
import {Like} from "../../domain/like/like";
import {LikeType} from "../../domain/like/valueObjects/LikeType";
import {LikeMap} from "../../mappers/LikeMap";
import {User} from "../../domain/user/user";

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