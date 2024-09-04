 interface DeliveryZoneRequest {
    Query: {
        offset: string
        limit: string
    }
    Params: {
        id: string
    },
    Body: {
        title: string
        description: string
        polygon: JSON
        price: number
    }
}
