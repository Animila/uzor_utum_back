import {IFileRepo} from "../../repositories/IFileRepository";
import {FileMap} from "../../mappers/FileMap";

interface GetAllFileInput {
    entity_id: string,
    entity_type: string,
}

export class GetAllFile {
    private repository: IFileRepo;

    constructor(repository: IFileRepo) {
        this.repository = repository;
    }

    async execute(input: GetAllFileInput): Promise<{
        id: string,
        name: string,
        entity_id: string,
        entity_type: string,
        type_file: string,
        path: string,
    }[]> {
        const { entity_id, entity_type } = input;

        const existingData = await this.repository.getByEntityIdAndType(entity_type, entity_id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }

        return existingData.map(item => FileMap.toPersistence(item));

    }
}