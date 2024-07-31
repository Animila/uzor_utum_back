import {generateUUID} from "../../infrastructure/uuid/generate";
import {OrderStatus} from "./valueObjects/OrderStatus";
import {Phone} from "./valueObjects/phone";
import {Email} from "./valueObjects/email";
import {Items} from "./valueObjects/items";

interface IOrder {
    token: string
    firstName: string
    lastName: string
    email: Email
    phone: Phone
    sendTypeId: string
    address?: string
    house?: string
    apartament?: string
    postalCode?: number
    cabinet?: string
    deliveryAt?: Date
    comment?: string
    shopId?: string
    receiverId: string
    paymentId?: string
    items: Items
    certificateId?: string
    promocodeId?: string
    addBonus: number
    useBonus: number
    totalAmount: number
    userId?: string
    status: OrderStatus
    createdAt: Date
    updatedAt: Date
}

export class Order {
    protected readonly _id: string
    public readonly props: IOrder

    constructor(props: IOrder, id?: string) {
        this._id = id || generateUUID('order');
        this.props = props;
    }

    getId(): string { return this._id }
    getToken(): string { return this.props.token }
    getFirstName(): string { return this.props.firstName }
    getLastName(): string { return this.props.lastName }
    getEmail(): Email { return this.props.email }
    getPhone(): Phone { return this.props.phone }
    getSendTypeId(): string { return this.props.sendTypeId }
    getAddress(): string | undefined { return this.props.address }
    getHouse(): string | undefined { return this.props.house }
    getApartment(): string | undefined { return this.props.apartament }
    getPostalCode(): number | undefined { return this.props.postalCode }
    getOffice(): string | undefined { return this.props.cabinet; }
    getDeliveryAt(): Date | undefined { return this.props.deliveryAt }
    getComment(): string | undefined { return this.props.comment }
    getShopId(): string | undefined { return this.props.shopId }
    getItems(): Items { return this.props.items }
    getAddBonus(): number { return this.props.addBonus }
    getUseBonus(): number { return this.props.useBonus }
    getTotalAmount(): number { return this.props.totalAmount }
    getUserId(): string | undefined { return this.props.userId }
    getStatus(): OrderStatus { return this.props.status }
    getPaymentId(): string | undefined { return this.props.paymentId }
    getReceiverId(): string { return this.props.receiverId }
    getCreatedAt(): Date { return this.props.createdAt }
    getUpdatedAt(): Date { return this.props.updatedAt }
    getCertificateId(): string | undefined { return this.props.certificateId }
    getPromoCode(): string | undefined { return this.props.promocodeId }
}



