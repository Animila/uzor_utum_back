import { orders as PersistenceData } from "@prisma/client";
import { Order } from "../domain/order/order";
import { Items, iItems } from "../domain/order/valueObjects/items";
import {Phone} from "../domain/order/valueObjects/phone";
import {Email} from "../domain/order/valueObjects/email";
import {OrderStatus} from "../domain/order/valueObjects/OrderStatus";

export class OrderMap {
    public static toDomain(raw: PersistenceData): Order | null {
        const items = Items.create(raw.items as iItems);
        const statusOrError = OrderStatus.create(raw.status)
        const phoneOrError = Phone.create(raw.phone)
        const emailOrError = Email.create(raw.email)
        if(statusOrError instanceof Error || phoneOrError instanceof Error || emailOrError instanceof Error) return null

        const result = new Order({
            firstName: raw.first_name,
            lastName: raw.last_name,
            phone: phoneOrError,
            email: emailOrError,

            sendTypeId: raw.send_type_id,
            address: raw.address || undefined,
            apartament: raw.apartament || undefined,
            house: raw.house || undefined,
            cabinet: raw.cabinet || undefined,
            postalCode: raw.postal_code || undefined,
            comment: raw.comment || undefined,
            deliveryAt: raw.delivery_at || undefined,
            receiverId: raw.receiver_id,
            shopId: raw.shop_id || undefined,

            addBonus: raw.add_bonuses,
            useBonus: raw.use_bonus,
            certificateId: raw.certificate_id || undefined,
            promocodeId: raw.promocode_id || undefined,

            totalAmount: raw.total_amount,
            userId: raw.user_id || undefined,
            token: raw.token,
            paymentId: raw.payment_id || undefined,
            items: items,
            status: statusOrError,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            deliveryPrice: raw.delivery_price
        }, raw.id)

        if(!result) return null
        return result
    }

    public static toPersistence(data: Order): {
        id: string
        first_name: string,
        last_name: string,
        phone: string,
        email: string,
        send_type_id: string,
        send_type_data?: any,
        address?: string,
        apartament?: string,
        house?: string,
        cabinet?: string,
        postal_code?: number,
        comment?: string,
        delivery_at?: Date,
        shop_id?: string,
        shop_data?: any,
        receiver_id: string,
        receiver_data?: any,
        add_bonus: number,
        use_bonus: number,
        total_amount: number,
        certificate_id?: string,
        certificate_data?: any,
        promocode_id?: string,
        promocode_data?: any,

        user_id?: string,
        user_data?: any
        token: string,
        payment_id?: string,
        payment_data?: any
        items: any,
        status: string,
        created_at: Date,
        updated_at: Date
        delivery_price: number
    } {
        return {
            id: data.getId(),
            first_name: data.getFirstName(),
            last_name: data.getLastName(),
            phone: data.getPhone().getFullPhone(),
            email: data.getEmail().getFull(),
            send_type_id: data.getSendTypeId(),
            address: data.getAddress(),
            apartament: data.getApartment(),
            house: data.getHouse(),
            cabinet: data.getOffice(),
            comment: data.getComment(),
            items: data.getItems().getAttributes(),
            add_bonus: data.getAddBonus(),
            use_bonus: data.getUseBonus(),
            payment_id: data.getPaymentId(),
            certificate_id: data.getCertificateId(),
            delivery_at: data.getDeliveryAt(),
            token: data.getToken(),
            shop_id: data.getShopId(),
            postal_code: data.getPostalCode(),
            promocode_id: data.getPromoCode(),
            status: data.getStatus().getValue(),
            receiver_id: data.getReceiverId(),
            total_amount: data.getTotalAmount(),
            user_id: data.getUserId(),
            created_at: data.getCreatedAt(),
            updated_at: data.getUpdatedAt(),
            delivery_price: data.getDeliveryPrice()
        }
    }
}
