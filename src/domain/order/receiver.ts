import {generateUUID} from "../../infrastructure/uuid/generate";
import {Phone} from "./valueObjects/phone";

interface IReceiver {
    token: string
    fullName: string
    phone: Phone
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
    getFullName(): string { return this.props.fullName }
    getPhone(): Phone { return this.props.phone }
}



