
interface CartRequest {
    Query: {
        token: string
        user_id: string
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
        count: number
    }
}
