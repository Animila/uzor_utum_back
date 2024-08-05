import {IProbRepository} from "../../repositories/IProbRepository";
import {ProbMap} from "../../mappers/ProbMap";
import {Guard} from "../../domain/guard";
import {Prob} from "../../domain/products/probs";

interface CreateProbInput {
    title: string
}

export class CreateProb {
    private decorateRepository: IProbRepository

    constructor(decorateRepository: IProbRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: CreateProbInput): Promise<Prob> {
        const {title} = input
        const token = new Prob({
            title: title
        })
        await this.decorateRepository.save(token)
        return token
    }
}


export class GetAllProb {
    private decorateRepository: IProbRepository

    constructor(decorateRepository: IProbRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(): Promise<{
        id: string,
        title: string,
        images?: any
    }[]> {
        const existingProbs = await this.decorateRepository.findAll()
        const result = existingProbs.map(item => {
            return ProbMap.toPersistence(item)
        })
        if(!existingProbs) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return result
    }
}

interface GetByIdProbInput {
    id: string
}

export class GetByIdProb {
    private decorateRepository: IProbRepository

    constructor(decorateRepository: IProbRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: GetByIdProbInput): Promise<Prob> {
        const { id } = input
        const existingProbs = await this.decorateRepository.findById(id)
        if(!existingProbs) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Проба не найдена'
            }))
        }
        return existingProbs
    }
}


interface UpdateProbInput {
    id: string,
    title?: string,
}

export class UpdateProb {
    private decorateRepository: IProbRepository

    constructor(decorateRepository: IProbRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: UpdateProbInput): Promise<Prob> {
        const { id, title } = input
        const existingProbs = await this.decorateRepository.findById(id)
        if(!existingProbs) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const newProb = new Prob({
            title: title || existingProbs.getTitle()
        }, existingProbs.getId())

        const savedProb = await this.decorateRepository.save(newProb)

        if(!savedProb) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedProb
    }
}

interface DeleteProbInput {
    id: string
}

export class DeleteProb {
    private decorateRepository: IProbRepository

    constructor(decorateRepository: IProbRepository) {
        this.decorateRepository = decorateRepository;
    }

    async execute(input: DeleteProbInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет id'
            }))
        return await this.decorateRepository.delete(id)

    }
}

