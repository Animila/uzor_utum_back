import {ISendTypeRepository} from "../../repositories/ISendTypeRepository";
import {SendType} from "../../domain/order/sendType";
import {SendTypeMap} from "../../mappers/SendTypeMap";
import {Guard} from "../../domain/guard";

interface CreateSendTypeInput {
    title: string
    price: number
    description: string
}

export class CreateSendType {
    private sendTypeRepository: ISendTypeRepository

    constructor(sendTypeRepository: ISendTypeRepository) {
        this.sendTypeRepository = sendTypeRepository;
    }

    async execute(input: CreateSendTypeInput): Promise<SendType> {
        const {title, price, description} = input

        const data = new SendType({
            title,
            price,
            description
        })
        await this.sendTypeRepository.save(data)
        return data
    }
}


export class GetAllSendType {
    private sendTypeRepository: ISendTypeRepository

    constructor(sendTypeRepository: ISendTypeRepository) {
        this.sendTypeRepository = sendTypeRepository;
    }

    async execute(): Promise<{
        id: string,
        title: string
        price: number
        description: string
    }[]> {
        const existingSendTypes = await this.sendTypeRepository.findAll()
        const sendTypes = existingSendTypes.map(item => {
            return SendTypeMap.toPersistence(item)
        })
        if(!existingSendTypes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Тип доставки не найден'
            }))
        }
        return sendTypes
    }
}

interface GetByIdSendTypeInput {
    id: string
}

export class GetByIdSendType {
    private sendTypeRepository: ISendTypeRepository

    constructor(sendTypeRepository: ISendTypeRepository) {
        this.sendTypeRepository = sendTypeRepository;
    }

    async execute(input: GetByIdSendTypeInput): Promise<SendType> {
        const { id } = input
        const existingSendTypes = await this.sendTypeRepository.findById(id)
        if(!existingSendTypes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Тип доставки не найден'
            }))
        }
        return existingSendTypes
    }
}


interface UpdateSendTypeInput {
    id: string,
    title?: string
    price?: number
    description?: string
}

export class UpdateSendType {
    private sendTypeRepository: ISendTypeRepository

    constructor(sendTypeRepository: ISendTypeRepository) {
        this.sendTypeRepository = sendTypeRepository;
    }

    async execute(input: UpdateSendTypeInput): Promise<SendType> {
        const { id, price, title, description } = input
        const existingSendTypes = await this.sendTypeRepository.findById(id)
        if(!existingSendTypes) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Получатель не найден'
            }))
        }

        const newSendType = new SendType({
            title: title || existingSendTypes.getTitle(),
            price: price || existingSendTypes.getPrice(),
            description: description || existingSendTypes.getDescription()
        }, existingSendTypes.getId())

        const savedSendType = await this.sendTypeRepository.save(newSendType)

        if(!savedSendType) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedSendType
    }
}

interface DeleteSendTypeInput {
    id: string
}

export class DeleteSendType {
    private sendTypeRepository: ISendTypeRepository

    constructor(sendTypeRepository: ISendTypeRepository) {
        this.sendTypeRepository = sendTypeRepository;
    }

    async execute(input: DeleteSendTypeInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет id'
            }))
        return await this.sendTypeRepository.delete(id)

    }
}

