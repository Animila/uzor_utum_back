import {generateUUID} from "../../infrastructure/uuid/generate";
import {Email} from "./valueObjects/email";
import {Phone} from "./valueObjects/phone";

interface ICertificate {
    phone?: Phone
    email?: Email
    accepted: boolean
    deliveryAt: Date
    userId?: string
    certificateTypeId: string
    code: string
    activated: boolean
    orderId?: string
}

export class Certificate {
    protected readonly _id: string
    public readonly props: ICertificate

    constructor(props: ICertificate, id?: string) {
        this._id = id || generateUUID('certificate');
        this.props = props;
    }

    getId(): string { return this._id }

    getPhone(): Phone | undefined { return this.props.phone }

    getEmail(): Email | undefined { return this.props.email }

    getAccepted(): boolean { return this.props.accepted }

    getActivated(): boolean { return this.props.activated }

    getDeliveryAt(): Date { return this.props.deliveryAt }

    getUserId(): string | undefined { return this.props.userId }

    getCertificateTypeId(): string { return this.props.certificateTypeId }

    getCode(): string { return this.props.code }

    getOrderId(): string | undefined { return this.props.orderId }

}



