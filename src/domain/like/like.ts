import {generateUUID} from "../../infrastructure/uuid/generate";
import {LikeType} from "./valueObjects/LikeType";

interface ILike {
    entityType: string
    entityId: string
    userId: string
    type: LikeType
    createdAt: Date
}

export class Like {
    protected readonly _id: string
    public readonly props: ILike

    constructor(props: ILike, id?: string) {
        this._id = id || generateUUID('like');
        this.props = props;
    }

    getId(): string { return this._id }

    getEntityType(): string { return this.props.entityType }

    getEntityId(): string { return this.props.entityId }

    getType(): LikeType { return this.props.type }

    getUserId(): string { return this.props.userId }

    getCreatedAt(): Date { return this.props.createdAt }

    like(): void {
        this.props.type = LikeType.create(LikeType.getAvailables().like) as LikeType
    }

    unlike(): void {
        this.props.type = LikeType.create(LikeType.getAvailables().unlike) as LikeType
    }

}



