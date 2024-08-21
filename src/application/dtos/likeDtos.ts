interface LikeRequest {
    Params: {
        id: string
    },
    Query: {
        entity_type: string
        entity_id: string
        user_id: string
        obj_type: string
        limit: string,
        offset: string,
    },
    Body: {
        entity_id: string
        entity_type: string
        type: string
        user_id: string
    }
}
