import {generateUUID} from "../../infrastructure/uuid/generate";
import {Sex} from "./valueObjects/sex";

interface IProduct {
    title: string
    article: string
    price: number
    images?: any
    sex: Sex
    description: string
    details: string
    delivery: string
    probIds: string[]
    sizeIds: string[]
    decorationIds: string[]
    available: number
    categoryId: string
    materialId: string
    createdAt: Date
    updatedAt: Date
}

export class Product {
    protected readonly _id: string
    public readonly props: IProduct

    constructor(props: IProduct, id?: string) {
        this._id = id || generateUUID('product');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

    getArticle(): string { return this.props.article }

    getPrice(): number { return this.props.price }

    getImages(): any { return this.props.images }

    getSex(): Sex { return this.props.sex }

    getDescription(): string { return this.props.description }

    getDetails(): string { return this.props.details }

    getDelivery(): string { return this.props.delivery }

    getCategory(): string { return this.props.categoryId }

    getMaterial(): string { return this.props.materialId }

    getAvailable(): number { return this.props.available }

    getCreatedAt(): Date { return this.props.createdAt }

    getUpdatedAt(): Date { return this.props.updatedAt }

    getProbIds(): string[] { return this.props.probIds; }

    getSizesIds(): string[] { return this.props.sizeIds; }

    getDecorationIds(): string[] { return this.props.decorationIds; }

}



