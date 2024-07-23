import {generateUUID} from "../../infrastructure/uuid/generate";
import {BonusType} from "./valueObjects/bonusType";

interface IBonus {
    type: BonusType
    description: string
    count: number
    created_at: Date
    user_id: string
}

export class Bonus {
    protected readonly _id: string
    public readonly props: IBonus

    constructor(props: IBonus, id?: string) {
        this._id = id || generateUUID('bonus');
        this.props = props;
    }

    getId(): string { return this._id }

    getDescription(): string { return this.props.description }

    getCount(): number { return this.props.count }

    getType(): BonusType { return this.props.type }

    getUserid(): string { return this.props.user_id }

    getCreatedAt(): Date { return this.props.created_at }

}