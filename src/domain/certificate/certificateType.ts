import {generateUUID} from "../../infrastructure/uuid/generate";

interface ICertificateType {
    value: number
    description: string
}

export class CertificateType {
    protected readonly _id: string
    public readonly props: ICertificateType

    constructor(props: ICertificateType, id?: string) {
        this._id = id || generateUUID('certificate_type');
        this.props = props;
    }

    getId(): string { return this._id }

    getValue(): number { return  this.props.value}

    getDescription(): string { return this.props.description }
}



