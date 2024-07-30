import {generateUUID} from "../../infrastructure/uuid/generate";
import {OrderStatus} from "./valueObjects/OrderStatus";
import {Phone} from "./valueObjects/phone";
import {Email} from "./valueObjects/email";
import {Items} from "./valueObjects/items";

interface IOrder {
    token: string
    first_name: string
    last_name: string
    email: Email
    phone: Phone
    send_type_id: string
    address?: string
    house?: string
    apartament?: string
    postal_code?: number
    cabinet?: number
    delivery_at?: Date
    comment?: string
    shop_id?: string
    receiver_id: string
    payment_id?: string
    items: Items
    certificate_id?: string
    promocode_id?: string
    add_bonuses: number
    use_bonus: number
    total_amount: number
    user_id?: string
    status: OrderStatus
    created_at: Date
    updated_at: Date
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
    getFirstName(): string { return this.props.first_name }
    getLastName(): string { return this.props.last_name }
    getEmail(): Email { return this.props.email }
    getPhone(): Phone { return this.props.phone }
    getSendTypeId(): string { return this.props.send_type_id }
    getAddress(): string | undefined { return this.props.address }
    getHouse(): string | undefined { return this.props.house }
    getApartment(): string | undefined { return this.props.apartament }
    getPostalCode(): number | undefined { return this.props.postal_code }
    getOffice(): number | undefined { return this.props.cabinet; }
    getDeliveryAt(): Date | undefined { return this.props.delivery_at }
    getComment(): string | undefined { return this.props.comment }
    getShopId(): string | undefined { return this.props.shop_id }
    getItems(): Items { return this.props.items }
    getAddBonus(): number { return this.props.add_bonuses }
    getUseBonus(): number { return this.props.use_bonus }
    getTotalAmount(): number { return this.props.total_amount }
    getUserId(): string | undefined { return this.props.user_id }
    getStatus(): OrderStatus { return this.props.status }
    getPaymentId(): string | undefined { return this.props.payment_id }
    getReceiverId(): string { return this.props.receiver_id }
    getCreatedAt(): Date { return this.props.created_at }
    getUpdatedAt(): Date { return this.props.updated_at }
    getCertificateId(): string | undefined { return this.props.certificate_id }
    getPromoCode(): string | undefined { return this.props.promocode_id }
}



