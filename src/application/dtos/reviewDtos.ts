interface ReviewRequest {
    Params: {
        id: string
    }
    Query: {
        url: string
        product_id: string
        old: boolean
        popular: boolean
        user_id: string
    },
    Body: {
        product_id: string
        name: string
        rating: number
        text: string
        order_id: string
        url: string
    }
}
