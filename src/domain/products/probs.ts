import {generateUUID} from "../../infrastructure/uuid/generate";

interface IProbs {
    title: string
}

export class Prob {
    protected readonly _id: string
    public readonly props: IProbs

    constructor(props: IProbs, id?: string) {
        this._id = id || generateUUID('size');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

}



