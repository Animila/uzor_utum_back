interface ReviewRequest {
    Params: {
        id: string
    }
    Query: {
        product_id: string
        old: boolean
        popular: boolean
        user_id: string
        limit: string
        offset: string
    },
    Body: {
        product_id: string
        name: string
        rating: number
        text: string
        order_id: string
    }
}
