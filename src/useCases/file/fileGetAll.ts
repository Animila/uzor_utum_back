import {IFileRepo} from "../../repositories/IFileRepository";
import {FileMap} from "../../mappers/FileMap";

interface GetAllFileInput {
    entity_id: string,
    entity_type: string,
    limit?: number,
    offset?: number
}

export class GetAllFile {
    private repository: IFileRepo;

    constructor(repository: IFileRepo) {
        this.repository = repository;
    }

    async execute(input: GetAllFileInput): Promise<{
        data: {
            id: string,
            name: string,
            entity_id: string,
            entity_type: string,
            type_file: string,
            path: string,
        }[],
        count: number
    }> {
        const { entity_id, entity_type, limit = 10, offset = 0 } = input;

        const existingData = await this.repository.getByEntityIdAndType(limit, offset, entity_type, entity_id)
        if(!existingData.data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Новость не найдена'
            }))
        }

        return {
            data: existingData.data.map(item => FileMap.toPersistence(item)),
            count: existingData.count
        }

    }
}
