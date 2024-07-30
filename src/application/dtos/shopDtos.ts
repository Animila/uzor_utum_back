interface ShopRequest {
    Params: {
        id: string
    },
    Body: {
        title: string
        address: string
        longitude: string
        latitude: string
        email: string
        times: JSON
        phones: string[]
    }
}