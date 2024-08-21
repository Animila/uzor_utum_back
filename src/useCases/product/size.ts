import {ISizeRepository} from "../../repositories/ISizeRepository";
import {SizeMap} from "../../mappers/SizeMap";
import {Guard} from "../../domain/guard";
import {Size} from "../../domain/products/sizes";

interface CreateSizeInput {
    title: string
}

export class CreateSize {
    private materialRepository: ISizeRepository

    constructor(materialRepository: ISizeRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: CreateSizeInput): Promise<Size> {
        const {title} = input
        const token = new Size({
            title: title
        })
        await this.materialRepository.save(token)
        return token
    }
}


export class GetAllSize {
    private materialRepository: ISizeRepository

    constructor(materialRepository: ISizeRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(limit: number = 10, offset: number = 0): Promise<{
        data: {
            id: string,
            title: string,
            images?: any
        }[],
        count: number
    }> {
        const existingSizes = await this.materialRepository.findAll(limit, offset)
        const result = existingSizes.data.map(item => {
            return SizeMap.toPersistence(item)
        })
        if(!result) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return {
            data: result,
            count: existingSizes.count
        }
    }
}

interface GetByIdSizeInput {
    id: string
}

export class GetByIdSize {
    private materialRepository: ISizeRepository

    constructor(materialRepository: ISizeRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: GetByIdSizeInput): Promise<Size> {
        const { id } = input
        const existingSizes = await this.materialRepository.findById(id)
        if(!existingSizes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Размер не найден'
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
    private materialRepository: ISizeRepository

    constructor(materialRepository: ISizeRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: UpdateSizeInput): Promise<Size> {
        const { id, title } = input
        const existingSizes = await this.materialRepository.findById(id)
        if(!existingSizes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const newSize = new Size({
            title: title || existingSizes.getTitle()
        }, existingSizes.getId())

        const savedSize = await this.materialRepository.save(newSize)

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
    private materialRepository: ISizeRepository

    constructor(materialRepository: ISizeRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: DeleteSizeInput): Promise<boolean> {
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
        return await this.materialRepository.delete(id)

    }
}

