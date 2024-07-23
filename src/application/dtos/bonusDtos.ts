
interface BonusRequest {
    Params: {
        id: string
        user_id: string
    },
    Body: {
        type: string
        description: string
        count: number
        created_at: Date
        user_id: string
    }
}
