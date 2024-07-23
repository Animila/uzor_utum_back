import {IBonusRepository} from "../../repositories/IBonusRepository";
import {Bonus} from "../../domain/bonus/bonus";
import {BonusType} from "../../domain/bonus/valueObjects/bonusType";

interface UpdateBonusInput {
    id: string
    type?: string
    description?: string
    count?: number
    user_id?: string
}

export class UpdateBonus {
    private repository: IBonusRepository;

    constructor(repository: IBonusRepository) {
        this.repository = repository;
    }

    async execute(input: UpdateBonusInput): Promise<Bonus> {
        const {
            id,
            type,
            description,
            count,
            user_id
        } = input;

        const existingData = await this.repository.findById(id)
        if(!existingData) {
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Бонус не найдена'
            }))
        }



        const typeOrError = type ? BonusType.create(type) : undefined

        if(typeOrError instanceof Error)
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'type',
                        message: 'Неправильный формат типов бонусов (minus. plus)'
                    }
                ]
            }))

        const newData =  new Bonus({
            type: typeOrError || existingData.getType(),
            count: count || existingData.getCount(),
            description: description || existingData.getDescription(),
            user_id: user_id || existingData.getUserid(),
            created_at: existingData.getCreatedAt()
        }, existingData.getId());

        const savedData = await this.repository.save(newData);
        if(!savedData) {
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка обновления скидки'
            }))
        }
        return newData;

    }
}