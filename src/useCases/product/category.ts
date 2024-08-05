import {ICategoryRepository} from "../../repositories/ICategoryRepository";
import {Category} from "../../domain/products/categories";
import {CategoryMap} from "../../mappers/CategoryMap";
import {Guard} from "../../domain/guard";

interface CreateCategoryInput {
    title: string
}

export class CreateCategory {
    private categoryRepository: ICategoryRepository

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(input: CreateCategoryInput): Promise<Category> {
        const {title} = input
        const token = new Category({
            title: title
        })
        await this.categoryRepository.save(token)
        return token
    }
}


export class GetAllCategory {
    private categoryRepository: ICategoryRepository

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(): Promise<{
        id: string,
        title: string,
        images?: any
    }[]> {
        const existingCategories = await this.categoryRepository.findAll()
        const categories = existingCategories.map(item => {
            return CategoryMap.toPersistence(item)
        })
        if(!existingCategories) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return categories
    }
}

interface GetByIdCategoryInput {
    id: string
}

export class GetByIdCategory {
    private categoryRepository: ICategoryRepository

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(input: GetByIdCategoryInput): Promise<Category> {
        const { id } = input
        const existingCategories = await this.categoryRepository.findById(id)
        if(!existingCategories) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }
        return existingCategories
    }
}


interface UpdateCategoryInput {
    id: string,
    title?: string,
}

export class UpdateCategory {
    private categoryRepository: ICategoryRepository

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(input: UpdateCategoryInput): Promise<Category> {
        const { id, title } = input
        const existingCategories = await this.categoryRepository.findById(id)
        if(!existingCategories) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Категория не найдена'
            }))
        }

        const newCategory = new Category({
            title: title || existingCategories.getTitle()
        }, existingCategories.getId())

        const savedCategory = await this.categoryRepository.save(newCategory)

        if(!savedCategory) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка сохранения'
            }))
        }

        return savedCategory
    }
}

interface DeleteCategoryInput {
    id: string
}

export class DeleteCategory {
    private categoryRepository: ICategoryRepository

    constructor(categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(input: DeleteCategoryInput): Promise<boolean> {
        const { id } = input
        const check = Guard.againstNullOrUndefined(id, 'id')
        if(!check.succeeded)
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет id'
            }))
        return await this.categoryRepository.delete(id)

    }
}

