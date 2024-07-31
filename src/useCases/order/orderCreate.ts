import {IOrderRepository} from "../../repositories/IOrderRepository";
import {Order} from "../../domain/order/order";
import {iItems, Items} from "../../domain/order/valueObjects/items";
import {Phone} from "../../domain/order/valueObjects/phone";
import {Email} from "../../domain/order/valueObjects/email";
import {OrderStatus} from "../../domain/order/valueObjects/OrderStatus";

interface CreateOrderInput {
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    send_type_id: string,
    address?: string,
    house?: string,
    apartment?: string,
    postal_code?: number,
    office?: string,
    delivery_at?: Date,
    shop_id?: string,
    comment?: string,
    receiver_id: string,
    payment_id: string,
    certificate_id: string,
    promocode_id: string,
    items: any,
    add_bonus: number,
    use_bonus: number,
    total_amount: number,
    user_id: string,
    token: string,
}

export class CreateOrder {
    private productRepository: IOrderRepository;

    constructor(productRepository: IOrderRepository) {
        this.productRepository = productRepository;
    }

    async execute(input: CreateOrderInput): Promise<Order> {
        const {
            token,
            add_bonus,
            address,
            apartment,
            certificate_id,
            comment,
            first_name,
            shop_id,
            delivery_at,
            items,
            email,
            house,
            last_name,
            office,
            postal_code,
            payment_id,
            phone,
            promocode_id,
            receiver_id,
            send_type_id,
            total_amount,
            use_bonus,
            user_id,
        } = input;

        const itemsOrError = Items.create(items as iItems);
        const phoneOrError = Phone.create(phone)
        const emailOrError = Email.create(email)
        
        const errors: Array<{type: string, message: string}> = []
        phoneOrError instanceof Error && errors.push({type: 'phone', message: phoneOrError.message})
        emailOrError instanceof Error && errors.push({type: 'email', message: emailOrError.message})

        if(errors.length > 0)
            throw new Error(JSON.stringify({
                status: 400,
                message: errors
            }))

        const product = new Order({
            firstName: first_name,
            lastName: last_name,
            email: emailOrError as Email,
            phone: phoneOrError as Phone,
            sendTypeId: send_type_id,
            address: address,
            house: house,
            apartament: apartment,
            cabinet: office,
            certificateId: certificate_id,
            items: itemsOrError,
            token: token,
            status: OrderStatus.create(OrderStatus.getAvailables().PENDING) as OrderStatus,
            promocodeId: promocode_id,
            receiverId: receiver_id,
            paymentId: payment_id,
            userId: user_id,
            totalAmount: total_amount,
            useBonus: use_bonus || 0,
            addBonus: add_bonus || 0,
            shopId: shop_id,
            comment: comment,
            deliveryAt: delivery_at,
            postalCode: postal_code,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await this.productRepository.save(product);
        return product;

    }
}