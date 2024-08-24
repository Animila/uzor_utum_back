interface UserRequest {
    Query: {
        limit: string,
        offset: string
        q: string
    }
    Params: {
        user_id: string
    },
    Body: {
        email: string,
        phone: string,
        first_name: string,
        last_name: string,
        role: string
    }
}
