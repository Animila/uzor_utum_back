import {IDecorateRepository} from "../../repositories/IDecorateRepository";
import {DecorateMap} from "../../mappers/DecorateMap";
import {Guard} from "../../domain/guard";
import {Decorate} from "../../domain/products/decorates";

interface CreateDecorateInput {
    title: string
}

export class CreateDecorate {
    private decorateRepository: IDecorateRepository

    constructor(decorateRepository: IDecorateRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: CreateDecorateInput): Promise<Decorate> {
        const {title} = input
        const token = new Decorate({
            title: title
        })
        await this.decorateRepository.save(token)
        return token
    }
}


export class GetAllDecorate {
    private decorateRepository: IDecorateRepository

    constructor(decorateRepository: IDecorateRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(limit: number = 10, offset: number = 0): Promise<{
        data: {
            id: string,
            title: string,
            images?: any
        }[],
        count: number
    }> {
        const existingDecorates = await this.decorateRepository.findAll(limit, offset)
        const result = existingDecorates.data.map(item => {
            return DecorateMap.toPersistence(item)
        })
        if(!result) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return {
            data: result,
            count: existingDecorates.count
        }
    }
}

interface GetByIdDecorateInput {
    id: string
}

export class GetByIdDecorate {
    private decorateRepository: IDecorateRepository

    constructor(decorateRepository: IDecorateRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: GetByIdDecorateInput): Promise<Decorate> {
        const { id } = input
        const existingDecorates = await this.decorateRepository.findById(id)
        if(!existingDecorates) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Вставка не найдена'
            }))
        }
        return existingDecorates
    }
}


interface UpdateDecorateInput {
    id: string,
    title?: string,
}

export class UpdateDecorate {
    private decorateRepository: IDecorateRepository

    constructor(decorateRepository: IDecorateRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: UpdateDecorateInput): Promise<Decorate> {
        const { id, title } = input
        const existingDecorates = await this.decorateRepository.findById(id)
        if(!existingDecorates) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const newDecorate = new Decorate({
            title: title || existingDecorates.getTitle()
        }, existingDecorates.getId())

        const savedDecorate = await this.decorateRepository.save(newDecorate)

        if(!savedDecorate) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedDecorate
    }
}

interface DeleteDecorateInput {
    id: string
}

export class DeleteDecorate {
    private decorateRepository: IDecorateRepository

    constructor(decorateRepository: IDecorateRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: DeleteDecorateInput): Promise<boolean> {
        const { id } = input
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
        return await this.decorateRepository.delete(id)

    }
}

