
interface CartRequest {
    Query: {
        token: string
        user_id: string
        limit: string,
        offset: string
    },
    Body: {}
}



interface ItemCartRequest {
    Query: {
        id: string
        token: string
    },
    Body: {
        product_id: string
        cart_id: string
        size_id: string,
        decorate_id: string,
        proba_id: string,
        count: number
    }
}
