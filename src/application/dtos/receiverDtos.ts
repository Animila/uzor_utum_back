interface ReceiverRequest {
    Params: {
        id: string
    },
    Query: {
      token: string
    },
    Body: {
        token: string
        phone: string
        full_name: string
    }
}