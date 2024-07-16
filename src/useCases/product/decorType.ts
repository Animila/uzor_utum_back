import {DecorationTypeMap} from "../../mappers/DecorationTypeMap";
import {Guard} from "../../domain/guard";
import {IDecorTypeRepository} from "../../repositories/IDecorTypeRepository";
import {DecorationType} from "../../domain/products/decor_types";

interface CreateDecorationTypeInput {
    title: string
}

export class CreateDecorationType {
    private decorTypeRepository: IDecorTypeRepository

    constructor(decorTypeRepository: IDecorTypeRepository) {
        this.decorTypeRepository = decorTypeRepository;
    }

    async execute(input: CreateDecorationTypeInput): Promise<DecorationType> {
        const {title} = input
        const token = new DecorationType({
            title: title
        })
        await this.decorTypeRepository.save(token)
        return token
    }
}


export class GetAllDecorationType {
    private decorTypeRepository: IDecorTypeRepository

    constructor(decorTypeRepository: IDecorTypeRepository) {
        this.decorTypeRepository = decorTypeRepository;
    }

    async execute(): Promise<{
        id: string,
        title: string
    }[]> {
        const existingDecorationTypes = await this.decorTypeRepository.findAll()
        const result = existingDecorationTypes.map(item => {
            return DecorationTypeMap.toPersistence(item)
        })
        if(!existingDecorationTypes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return result
    }
}

interface GetByIdDecorationTypeInput {
    id: string
}

export class GetByIdDecorationType {
    private decorTypeRepository: IDecorTypeRepository

    constructor(decorTypeRepository: IDecorTypeRepository) {
        this.decorTypeRepository = decorTypeRepository;
    }

    async execute(input: GetByIdDecorationTypeInput): Promise<DecorationType> {
        const { id } = input
        const existingDecorationTypes = await this.decorTypeRepository.findById(id)
        if(!existingDecorationTypes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return existingDecorationTypes
    }
}


interface UpdateDecorationTypeInput {
    id: string,
    title?: string,
}

export class UpdateDecorationType {
    private decorTypeRepository: IDecorTypeRepository

    constructor(decorTypeRepository: IDecorTypeRepository) {
        this.decorTypeRepository = decorTypeRepository;
    }

    async execute(input: UpdateDecorationTypeInput): Promise<DecorationType> {
        const { id, title } = input
        const existingDecorationTypes = await this.decorTypeRepository.findById(id)
        if(!existingDecorationTypes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const newDecorationType = new DecorationType({
            title: title || existingDecorationTypes.getTitle()
        }, existingDecorationTypes.getId())

        const savedDecorationType = await this.decorTypeRepository.save(newDecorationType)

        if(!savedDecorationType) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedDecorationType
    }
}

interface DeleteDecorationTypeInput {
    id: string
}

export class DeleteDecorationType {
    private decorTypeRepository: IDecorTypeRepository

    constructor(decorTypeRepository: IDecorTypeRepository) {
        this.decorTypeRepository = decorTypeRepository;
    }

    async execute(input: DeleteDecorationTypeInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет id'
            }))
        return await this.decorTypeRepository.delete(id)

    }
}

