import {generateUUID} from "../../infrastructure/uuid/generate";
import {Phones} from "./valueObjects/phones";
import {Times} from "./valueObjects/times";
import {Email} from "./valueObjects/email";

interface IShop {
    title: string
    address: string
    longitude: string // долгота
    latitude: string //широта
    email: Email
    times: Times
    phones: Phones
}

export class Shop {
    protected readonly _id: string
    public readonly props: IShop

    constructor(props: IShop, id?: string) {
        this._id = id || generateUUID('shop');
        this.props = props;
    }

    getId(): string { return this._id }
    getTitle(): string { return this.props.title }
    getAddress(): string { return this.props.address }
    getLongitude(): string { return this.props.longitude }
    getLatitude(): string { return this.props.latitude }
    getEmail(): Email { return this.props.email }
    getTimes(): Times { return this.props.times }
    getPhones(): Phones { return this.props.phones }
}



