import {generateUUID} from "../../infrastructure/uuid/generate";

interface ICartItem {
    productId: string
    cartId: string
    probaId?: string
    decorateId?: string
    sizeId?: string
    count: number
    updatedAt: Date
    createdAt: Date
}

export class CartItem {
    protected readonly _id: string
    public readonly props: ICartItem

    constructor(props: ICartItem, id?: string) {
        this._id = id || generateUUID('itemcart');
        this.props = props;
    }

    getId(): string { return this._id }

    getProductId(): string { return this.props.productId }

    getCartId(): string { return this.props.cartId }

    getCount(): number { return this.props.count }

    getUpdatedAt(): Date { return this.props.updatedAt }

    getCreatedAt(): Date { return this.props.createdAt }

    getProbaId(): string | undefined { return this.props.probaId }

    getDecorateId(): string | undefined { return this.props.decorateId }

    getSizeId(): string | undefined { return this.props.sizeId }

}



