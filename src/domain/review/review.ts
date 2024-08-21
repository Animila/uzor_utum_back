import {generateUUID} from "../../infrastructure/uuid/generate";

interface IReview {
    url: string
    name: string
    rating: number
    text: string
    orderId: string
    productId: string
    createdAt: Date
    publishedAt?: Date
    images?: any
}

export class Review {
    protected readonly _id: string
    public readonly props: IReview

    constructor(props: IReview, id?: string) {
        this._id = id || generateUUID('review');
        this.props = props;
    }

    getId(): string { return this._id }

    getUrl(): string { return this.props.url }

    getName(): string { return this.props.name }

    getImages(): any { return this.props.images }

    getText(): string { return this.props.text }

    getRating(): number { return this.props.rating }

    getOrderId(): string { return this.props.orderId }

    getProductId(): string { return this.props.productId }

    getCreatedAt(): Date { return this.props.createdAt }

    getPublishedAt(): Date | undefined { return this.props.publishedAt }

}



