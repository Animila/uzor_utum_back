import {INewsRepository} from "../../repositories/INewsRepository";
import {News} from "../../domain/news/news";
import {IFileRepo} from "../../repositories/IFileRepository";
import {GetAllFile} from "../file/fileGetAll";

interface GetByIdNewsInput {
    id: string
}

export class GetByIdNews {
    private repository: INewsRepository;
    private fileRepo: IFileRepo

    constructor(repository: INewsRepository, fileRepo: IFileRepo) {
        this.repository = repository;
        this.fileRepo = fileRepo;
    }

    async execute(input: GetByIdNewsInput): Promise<News> {
        const { id } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }
        const getFiles = new GetAllFile(this.fileRepo)
        existingData.props.images = await getFiles.execute({limit: 10, offset: 0, entity_id: existingData.getId(), entity_type: 'news'})
        return existingData;
    }
}
