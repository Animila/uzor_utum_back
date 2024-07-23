import {generateUUID} from "../../infrastructure/uuid/generate";

interface IPromoCode {
    code: string
    description: string
    discount: number
    validFrom: Date
    validTo: Date
    active: boolean
}

export class PromoCode {
    protected readonly _id: string
    public readonly props: IPromoCode

    constructor(props: IPromoCode, id?: string) {
        this._id = id || generateUUID('promocode');
        this.props = props;
    }

    getId(): string { return this._id }

    getCode(): string { return this.props.code }

    getDescription(): string { return this.props.description }

    getDiscount(): number { return this.props.discount }

    getValidFrom(): Date { return this.props.validFrom }

    getValidTo(): Date { return this.props.validTo }

    getActive(): boolean { return this.props.active }

    activated(): void {
        this.props.active = false
    }


}



