import {generateUUID} from "../../infrastructure/uuid/generate";

interface IDecorationTypes {
    title: string
}

export class DecorationType {
    protected readonly _id: string
    public readonly props: IDecorationTypes

    constructor(props: IDecorationTypes, id?: string) {
        this._id = id || generateUUID('decoration_type');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

}



