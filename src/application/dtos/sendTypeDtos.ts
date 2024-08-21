interface SendTypeRequest {
    Query: {
        limit: string
        offset: string
    }
    Params: {
        id: string
    },
    Body: {
        title: string
        price: number
        description: string
    }
}
