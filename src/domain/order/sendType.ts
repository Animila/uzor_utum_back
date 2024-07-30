import {generateUUID} from "../../infrastructure/uuid/generate";

interface ISendType {
    title: string
    price: number
    description: string
}

export class SendType {
    protected readonly _id: string
    public readonly props: ISendType

    constructor(props: ISendType, id?: string) {
        this._id = id || generateUUID('send_type');
        this.props = props;
    }

    getId(): string { return this._id }
    getTitle(): string { return this.props.title }
    getPrice(): number { return this.props.price }
    getDescription(): string { return this.props.description }
}



