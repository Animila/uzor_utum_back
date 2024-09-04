import {generateUUID} from "../../infrastructure/uuid/generate";

interface IDeliveryZone {
    title: string
    description: string
    polygon: number[][];
    price: number
}

export class DeliveryZone {
    zone() {
        throw new Error("Method not implemented.");
    }
    protected readonly _id: string
    public readonly props: IDeliveryZone

    constructor(props: IDeliveryZone, id?: string) {
        this._id = id || generateUUID('deliveryzone');
        this.props = props;
    }

    getId(): string { return this._id }
    getTitle(): string { return this.props.title }
    getDescription(): string { return this.props.description }
    getPolygon(): number[][] { return this.props.polygon }
    getPrice(): number { return this.props.price }

}



