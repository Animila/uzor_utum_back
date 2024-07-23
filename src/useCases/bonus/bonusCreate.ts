import {IBonusRepository} from "../../repositories/IBonusRepository";
import {Bonus} from "../../domain/bonus/bonus";
import {BonusType} from "../../domain/bonus/valueObjects/bonusType";

interface CreateBonusInput {
    type: string
    description: string
    count: number
    created_at: Date
    user_id: string
}

export class CreateBonus {
    private repository: IBonusRepository;

    constructor(repository: IBonusRepository) {
        this.repository = repository;
    }

    async execute(input: CreateBonusInput): Promise<Bonus> {
        const {
            type,
            description,
            count,
            created_at,
            user_id
        } = input;

        const typeOrError = BonusType.create(type)

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
            type: typeOrError,
            count: count,
            description: description,
            user_id: user_id,
            created_at: new Date()
        })

        await this.repository.save(newData);
        return newData;

    }
}