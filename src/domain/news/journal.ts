import {generateUUID} from "../../infrastructure/uuid/generate";

interface IJournal {
    title: string
}

export class Journal {
    protected readonly _id: string
    public readonly props: IJournal

    constructor(props: IJournal, id?: string) {
        this._id = id || generateUUID('journal');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

}



