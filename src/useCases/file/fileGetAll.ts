import {IFileRepo} from "../../repositories/IFileRepository";
import {FileMap} from "../../mappers/FileMap";
import {GetAllSize, GetByIdSize} from "../product/size";
import {GetAllProb, GetByIdProb} from "../product/probs";
import {GetAllDecorate, GetByIdDecorate} from "../product/decorate";
import {SizeMap} from "../../mappers/SizeMap";
import {DecorateMap} from "../../mappers/DecorateMap";
import {ProbMap} from "../../mappers/ProbMap";
import {PrismaMaterialRepo} from "../../infrastructure/prisma/repo/PrismaMaterialRepo";
import {PrismaSizeRepo} from "../../infrastructure/prisma/repo/PrismaSizeRepo";
import {PrismaDecorateRepo} from "../../infrastructure/prisma/repo/PrismaDecorateRepo";
import {PrismaProbRepo} from "../../infrastructure/prisma/repo/PrismaProbRepo";

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
                message: 'Файлы не найдены'
            }))
        }

        const data = existingData.data.map(item => FileMap.toPersistence(item))

        return {
            data: data,
            count: existingData.count
        }

    }
}
