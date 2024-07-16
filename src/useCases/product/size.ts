import {ISizeRepository} from "../../repositories/ISizeRepository";
import {SizeMap} from "../../mappers/SizeMap";
import {Guard} from "../../domain/guard";
import {Size} from "../../domain/products/sizes";

interface CreateSizeInput {
    title: string
}

export class CreateSize {
    private sizeRepository: ISizeRepository

    constructor(sizeRepository: ISizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    async execute(input: CreateSizeInput): Promise<Size> {
        const {title} = input
        const token = new Size({
            title: title
        })
        await this.sizeRepository.save(token)
        return token
    }
}


export class GetAllSize {
    private sizeRepository: ISizeRepository

    constructor(sizeRepository: ISizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    async execute(): Promise<{
        id: string,
        title: string
    }[]> {
        const existingSizes = await this.sizeRepository.findAll()
        const result = existingSizes.map(item => {
            return SizeMap.toPersistence(item)
        })
        if(!existingSizes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return result
    }
}

interface GetByIdSizeInput {
    id: string
}

export class GetByIdSize {
    private sizeRepository: ISizeRepository

    constructor(sizeRepository: ISizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    async execute(input: GetByIdSizeInput): Promise<Size> {
        const { id } = input
        const existingSizes = await this.sizeRepository.findById(id)
        if(!existingSizes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return existingSizes
    }
}


interface UpdateSizeInput {
    id: string,
    title?: string,
}

export class UpdateSize {
    private sizeRepository: ISizeRepository

    constructor(sizeRepository: ISizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    async execute(input: UpdateSizeInput): Promise<Size> {
        const { id, title } = input
        const existingSizes = await this.sizeRepository.findById(id)
        if(!existingSizes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const newSize = new Size({
            title: title || existingSizes.getTitle()
        }, existingSizes.getId())

        const savedSize = await this.sizeRepository.save(newSize)

        if(!savedSize) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedSize
    }
}

interface DeleteSizeInput {
    id: string
}

export class DeleteSize {
    private sizeRepository: ISizeRepository

    constructor(sizeRepository: ISizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    async execute(input: DeleteSizeInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет id'
            }))
        return await this.sizeRepository.delete(id)

    }
}

