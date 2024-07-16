import {generateUUID} from "../../infrastructure/uuid/generate";

interface ICategory {
    title: string
}

export class Category {
    protected readonly _id: string
    public readonly props: ICategory

    constructor(props: ICategory, id?: string) {
        this._id = id || generateUUID('category');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

}



