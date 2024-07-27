import {generateUUID} from "../../infrastructure/uuid/generate";

interface ICart {
    userId?: string
    token: string
    totalAmount: number
    updatedAt: Date
    createdAt: Date
}

export class Cart {
    protected readonly _id: string
    public readonly props: ICart

    constructor(props: ICart, id?: string) {
        this._id = id || generateUUID('cart');
        this.props = props;
    }

    getId(): string { return this._id }

    getUserId(): string | undefined { return this.props.userId }

    getToken(): string { return this.props.token }

    getTotalAmount(): number { return this.props.totalAmount }

    getUpdatedAt(): Date { return this.props.updatedAt }

    getCreatedAt(): Date { return this.props.createdAt }

}



