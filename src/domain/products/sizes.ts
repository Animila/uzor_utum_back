import {generateUUID} from "../../infrastructure/uuid/generate";

interface ISizes {
    title: string
}

export class Size {
    protected readonly _id: string
    public readonly props: ISizes

    constructor(props: ISizes, id?: string) {
        this._id = id || generateUUID('size');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

}



