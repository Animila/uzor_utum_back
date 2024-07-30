import {generateUUID} from "../../infrastructure/uuid/generate";

interface IReceiver {
    token: string
    full_name: string
    phone: string
}

export class Receiver {
    protected readonly _id: string
    public readonly props: IReceiver

    constructor(props: IReceiver, id?: string) {
        this._id = id || generateUUID('receiver');
        this.props = props;
    }

    getId(): string { return this._id }
    getToken(): string { return this.props.token }
    getFullName(): string { return this.props.full_name }
    getPhone(): string { return this.props.phone }
}



