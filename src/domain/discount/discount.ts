import {generateUUID} from "../../infrastructure/uuid/generate";

interface IDiscount {
    productId: string;
    percentage: number;
    startDate: Date;
    endDate: Date;
    activated: boolean;
}

export class Discount {
    protected readonly _id: string
    public readonly props: IDiscount

    constructor(props: IDiscount, id?: string) {
        this._id = id || generateUUID('discount');
        this.props = props;
    }

    getId(): string { return this._id }

    getProductId(): string { return this.props.productId; }

    getPercentage(): number { return this.props.percentage; }

    getStartDate(): Date { return this.props.startDate; }

    getEndDate(): Date { return this.props.endDate; }

    getActivated(): boolean { return this.props.activated; }

}



