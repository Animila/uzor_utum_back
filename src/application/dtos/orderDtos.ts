interface OrderRequest {
    Params: {
        id: string
    },
    Query: {
        user_id: string,
        token: string,
        first_name: string,
        last_name: string,
        phone: string,
        email: string,
        total_amount: string,
    },
    Body: {
        token: string
        first_name: string
        last_name: string
        email: string
        phone: string
        send_type_id: string
        address?: string
        house?: string
        apartament?: string
        postal_code?: number
        cabinet?: number
        delivery_at?: Date
        comment?: string
        shop_id?: string
        receiver_id: string
        payment_id?: string
        items: JSON
        certificate_id?: string
        promocode_id?: string
        add_bonuses: number
        use_bonus: number
        total_amount: number
        user_id?: string
        created_at: Date
    }
}

