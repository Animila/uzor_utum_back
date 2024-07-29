import {generateUUID} from "../../infrastructure/uuid/generate";

interface ICertificate {
    phone?: string
    email?: string
    accepted: boolean
    deliveryAt: Date
    userId?: string
    certificateTypeId: string
    code: string
    activated: boolean
}

export class Certificate {
    protected readonly _id: string
    public readonly props: ICertificate

    constructor(props: ICertificate, id?: string) {
        this._id = id || generateUUID('certificate');
        this.props = props;
    }

    getId(): string { return this._id }

    getPhone(): string | undefined { return this.props.phone }

    getEmail(): string | undefined { return this.props.email }

    getAccepted(): boolean { return this.props.accepted }

    getActivated(): boolean { return this.props.activated }

    getDeliveryAt(): Date { return this.props.deliveryAt }

    getUserId(): string | undefined { return this.props.userId }

    getCertificateTypeId(): string { return this.props.certificateTypeId }

    getCode(): string { return this.props.code }

}



