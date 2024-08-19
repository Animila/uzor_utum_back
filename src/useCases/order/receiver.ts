import {IReceiverRepository} from "../../repositories/IReceiverRepository";
import {Receiver} from "../../domain/order/receiver";
import {ReceiverMap} from "../../mappers/ReceiverMap";
import {Guard} from "../../domain/guard";
import {Phone} from "../../domain/order/valueObjects/phone";

interface CreateReceiverInput {
    token: string
    phone: string
    full_name: string
}

export class CreateReceiver {
    private receiverRepository: IReceiverRepository

    constructor(receiverRepository: IReceiverRepository) {
        this.receiverRepository = receiverRepository;
    }

    async execute(input: CreateReceiverInput): Promise<Receiver> {
        const {token, phone, full_name} = input

        const phoneOrError = Phone.create(phone)
        const errors: Array<{type: string, message: string}> = []
        phoneOrError instanceof Error && errors.push({type: 'phone', message: phoneOrError.message})
        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))

        const data = new Receiver({
            token,
            phone: phoneOrError as Phone,
            fullName: full_name
        })
        await this.receiverRepository.save(data)
        return data
    }
}


export class GetAllReceiver {
    private receiverRepository: IReceiverRepository

    constructor(receiverRepository: IReceiverRepository) {
        this.receiverRepository = receiverRepository;
    }

    async execute(token?: string): Promise<{
        id: string,
        token: string
        phone: string
        full_name: string
    }[]> {
        const existingReceivers = await this.receiverRepository.findAll(token)
        const receivers = existingReceivers.map(item => {
            return ReceiverMap.toPersistence(item)
        })
        if(!existingReceivers) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Получатель не найден'
            }))
        }
        return receivers
    }
}

interface GetByIdReceiverInput {
    id: string
}

export class GetByIdReceiver {
    private receiverRepository: IReceiverRepository

    constructor(receiverRepository: IReceiverRepository) {
        this.receiverRepository = receiverRepository;
    }

    async execute(input: GetByIdReceiverInput): Promise<Receiver> {
        const { id } = input
        const existingReceivers = await this.receiverRepository.findById(id)
        if(!existingReceivers) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Получатель не найден'
            }))
        }
        return existingReceivers
    }
}


interface UpdateReceiverInput {
    id: string,
    token?: string
    phone?: string
    full_name?: string
}

export class UpdateReceiver {
    private receiverRepository: IReceiverRepository

    constructor(receiverRepository: IReceiverRepository) {
        this.receiverRepository = receiverRepository;
    }

    async execute(input: UpdateReceiverInput): Promise<Receiver> {
        const { id, token, full_name, phone } = input
        const existingReceivers = await this.receiverRepository.findById(id)
        if(!existingReceivers) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Получатель не найден'
            }))
        }

        const phoneOrError = phone ? Phone.create(phone) : undefined
        const errors: Array<{type: string, message: string}> = []
        phoneOrError instanceof Error && errors.push({type: 'phone', message: phoneOrError.message})
        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))

        const newReceiver = new Receiver({
            token: token || existingReceivers.getToken(),
            phone: phoneOrError as Phone || existingReceivers.getPhone(),
            fullName: full_name || existingReceivers.getFullName()
        }, existingReceivers.getId())

        const savedReceiver = await this.receiverRepository.save(newReceiver)

        if(!savedReceiver) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedReceiver
    }
}

interface DeleteReceiverInput {
    id: string
}

export class DeleteReceiver {
    private receiverRepository: IReceiverRepository

    constructor(receiverRepository: IReceiverRepository) {
        this.receiverRepository = receiverRepository;
    }

    async execute(input: DeleteReceiverInput): Promise<boolean> {
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
        return await this.receiverRepository.delete(id)

    }
}

