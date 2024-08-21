import {IReviewRepository} from "../../repositories/IReviewRepository";
import {Review} from "../../domain/review/review";
import {IFileRepo} from "../../repositories/IFileRepository";
import {GetAllFile} from "../file/fileGetAll";

interface GetByIdReviewInput {
    id: string
}

export class GetByIdReview {
    private repository: IReviewRepository;
    private fileRepo: IFileRepo

    constructor(repository: IReviewRepository, fileRepo: IFileRepo) {
        this.repository = repository;
        this.fileRepo = fileRepo;
    }

    async execute(input: GetByIdReviewInput): Promise<Review> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Лайки не найдены'
            }))
        }
        const getFiles = new GetAllFile(this.fileRepo)
        const data = await getFiles.execute({limit: 10, offset: 0, entity_id: existingData.getId(), entity_type: 'review'})
        existingData.props.images = data.data
        return existingData;
    }
}
