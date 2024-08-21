interface ReceiverRequest {
    Params: {
        id: string
    },
    Query: {
        token: string
        limit: string
        offset: string
    },
    Body: {
        token: string
        phone: string
        full_name: string
    }
}
