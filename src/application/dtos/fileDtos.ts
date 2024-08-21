interface FileRouting {
    Query: {
        limit: string,
        offset: string,
    }
    Params: {
        id: string
        entity_id: string,
        entity_type: string,
    },
    Body: {
        entity_type: string
        entity_id: string
        files: object
    }
}
