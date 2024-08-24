interface OrderRequest {
    Params: {
        id: string
    },
    Query: {
        user_id: string,
        token: string,
        shop_id: string,
        send_type_id: string,
        created_at: string,
        updated_at: string,
        status: string[]
        limit: string,
        offset: string,
        q: string
    },
    Body: {
        token: string
        first_name: string
        last_name: string
        email: string
        phone: string
        send_type_id: string
        address: string
        house: string
        apartament: string
        postal_code: number
        cabinet: number
        delivery_at: Date
        comment: string
        shop_id: string
        receiver_id: string
        payment_id: string
        items: JSON
        certificate_id: string
        promocode_id: string
        add_bonus: number
        use_bonus: number
        total_amount: number
        user_id: string
        created_at: Date
        status: string
    }
}

