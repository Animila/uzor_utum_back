import {generateUUID} from "../../infrastructure/uuid/generate";
import {Category} from "./categories";
import {Material} from "./materials";
import {Attributes} from "./valueObjects/attributes";
import {Sex} from "./valueObjects/sex";



interface IProduct {
    title: string
    article: string
    price: number
    pathImages: string[]
    sex: Sex
    description: string
    details: string
    delivery: string
    attributes: Attributes
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

    getPathImages(): string[] { return this.props.pathImages }

    getSex(): Sex { return this.props.sex }

    getDescription(): string { return this.props.description }

    getDetails(): string { return this.props.details }

    getDelivery(): string { return this.props.delivery }

    getCategory(): string { return this.props.categoryId }

    getMaterial(): string { return this.props.materialId }

    getAvailable(): number { return this.props.available }

    getCreatedAt(): Date { return this.props.createdAt }

    getUpdatedAt(): Date { return this.props.updatedAt }

    getAttributes(): Attributes { return this.props.attributes; }

}



