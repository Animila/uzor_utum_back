 interface DeliveryZoneRequest {
    Query: {
        offset: string
        limit: string
    }
    Params: {
        id: string
        longitude: string
        latitude: string
    },
    Body: {
        title: string
        description: string
        polygon: number[][]
        price: number
    }
}
