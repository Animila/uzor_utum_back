import {generateUUID} from "../../infrastructure/uuid/generate";

interface IDecorations {
    title: string
}

export class Decorate {
    protected readonly _id: string
    public readonly props: IDecorations

    constructor(props: IDecorations, id?: string) {
        this._id = id || generateUUID('decorate');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

}



