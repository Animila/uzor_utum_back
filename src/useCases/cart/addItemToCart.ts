import {ICartItemRepository} from "../../repositories/ICartItemRepository";
import {CartItem} from "../../domain/cart/cartItem";

interface AddItemToCartInput {
    product_id: string
    size_id?: string,
    decorate_id?: string,
    proba_id?: string,
    cart_id: string
    count: number
}

export class AddItemToCart {
    private repository: ICartItemRepository;

    constructor(repository: ICartItemRepository) {
        this.repository = repository;
    }

    async execute(input: AddItemToCartInput): Promise<CartItem> {
        const {
            product_id,
            cart_id,
            count,
            proba_id,
            size_id,
            decorate_id
        } = input;

        const data = new CartItem({
            productId: product_id,
            sizeId: size_id,
            probaId: proba_id,
            decorateId: decorate_id,
            cartId: cart_id,
            count: count,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.repository.save(data);
        return data;

    }
}