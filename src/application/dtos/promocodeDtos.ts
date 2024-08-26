interface PromoCodeRequest {
    Query: {
        limit: string,
        offset: string,
        email: string,
        phone: string,
        user_id: string,
    }
    Params: {
        id: string
    },
    Body: {
        code: string
        description: string
        discount: number
        valid_to: Date
        valid_from: Date
        active: boolean
    };
}
