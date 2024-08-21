import {Journal} from "../../domain/news/journal";
import {IJournalRepository} from "../../repositories/IJournalRepository";
import {JournalMap} from "../../mappers/JournalMap";
import {Guard} from "../../domain/guard";

interface CreateJournalInput {
    title: string
}

export class CreateJournal {
    private repository: IJournalRepository

    constructor(repository: IJournalRepository) {
        this.repository = repository;
    }

    async execute(input: CreateJournalInput): Promise<Journal> {
        const {title} = input
        const token = new Journal({
            title: title
        })
        await this.repository.save(token)
        return token
    }
}

interface GetAllJournalInput {
    offset: number
    limit: number
}

export class GetAllJournal {
    private repository: IJournalRepository

    constructor(repository: IJournalRepository) {
        this.repository = repository;
    }

    async execute(input: GetAllJournalInput): Promise<{
        data: {
            id: string,
            title: string
        }[],
        count: number
    }> {
        const {offset, limit} = input
        const existingJournals = await this.repository.findAll(limit, offset)

        if(!existingJournals.data) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Журнал не найден'
            }))
        }
        return {
            data: existingJournals.data.map(item => {
                return JournalMap.toPersistence(item)
            }),
            count: existingJournals.count
        }
    }
}

interface GetByIdJournalInput {
    id: string
}

export class GetByIdJournal {
    private repository: IJournalRepository

    constructor(repository: IJournalRepository) {
        this.repository = repository;
    }

    async execute(input: GetByIdJournalInput): Promise<Journal> {
        const { id } = input
        const existingJournals = await this.repository.findById(id)
        if(!existingJournals) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Журнал не найден'
            }))
        }
        return existingJournals
    }
}


interface UpdateJournalInput {
    id: string,
    title?: string,
}

export class UpdateJournal {
    private repository: IJournalRepository

    constructor(repository: IJournalRepository) {
        this.repository = repository;
    }

    async execute(input: UpdateJournalInput): Promise<Journal> {
        const { id, title } = input
        const existingJournals = await this.repository.findById(id)
        if(!existingJournals) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Журнал не найден'
            }))
        }

        const newJournal = new Journal({
            title: title || existingJournals.getTitle()
        }, existingJournals.getId())

        const savedJournal = await this.repository.save(newJournal)

        if(!savedJournal) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedJournal
    }
}

interface DeleteJournalInput {
    id: string
}

export class DeleteJournal {
    private repository: IJournalRepository

    constructor(repository: IJournalRepository) {
        this.repository = repository;
    }

    async execute(input: DeleteJournalInput): Promise<boolean> {
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
        return await this.repository.delete(id)

    }
}

