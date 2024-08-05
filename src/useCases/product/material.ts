import {IMaterialRepository} from "../../repositories/IMaterialRepository";
import {MaterialMap} from "../../mappers/MaterialMap";
import {Guard} from "../../domain/guard";
import {Material} from "../../domain/products/materials";

interface CreateMaterialInput {
    title: string
}

export class CreateMaterial {
    private materialRepository: IMaterialRepository

    constructor(materialRepository: IMaterialRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: CreateMaterialInput): Promise<Material> {
        const {title} = input
        const token = new Material({
            title: title
        })
        await this.materialRepository.save(token)
        return token
    }
}


export class GetAllMaterial {
    private materialRepository: IMaterialRepository

    constructor(materialRepository: IMaterialRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(): Promise<{
        id: string,
        title: string,
        images?: any
    }[]> {
        const existingMaterials = await this.materialRepository.findAll()
        const result = existingMaterials.map(item => {
            return MaterialMap.toPersistence(item)
        })
        if(!existingMaterials) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return result
    }
}

interface GetByIdMaterialInput {
    id: string
}

export class GetByIdMaterial {
    private materialRepository: IMaterialRepository

    constructor(materialRepository: IMaterialRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: GetByIdMaterialInput): Promise<Material> {
        const { id } = input
        const existingMaterials = await this.materialRepository.findById(id)
        if(!existingMaterials) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Материал не найден'
            }))
        }
        return existingMaterials
    }
}


interface UpdateMaterialInput {
    id: string,
    title?: string,
}

export class UpdateMaterial {
    private materialRepository: IMaterialRepository

    constructor(materialRepository: IMaterialRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: UpdateMaterialInput): Promise<Material> {
        const { id, title } = input
        const existingMaterials = await this.materialRepository.findById(id)
        if(!existingMaterials) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const newMaterial = new Material({
            title: title || existingMaterials.getTitle()
        }, existingMaterials.getId())

        const savedMaterial = await this.materialRepository.save(newMaterial)

        if(!savedMaterial) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedMaterial
    }
}

interface DeleteMaterialInput {
    id: string
}

export class DeleteMaterial {
    private materialRepository: IMaterialRepository

    constructor(materialRepository: IMaterialRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(input: DeleteMaterialInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет id'
            }))
        return await this.materialRepository.delete(id)

    }
}

