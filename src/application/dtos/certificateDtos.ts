interface CertificateRequest {
    Params: {
        id: string
    },
    Query: {
        certificate_type_id?: string
        code?: string
        limit: string,
        offset: string
        q: string
    },
    Body: {
        phone: string
        email: string
        accepted: boolean
        delivery_at: Date
        user_id: string
        certificate_type_id: string
    }
}


interface CertificateTypeRequest {
    Query: {
        limit: string,
        offset: string,
    }
    Params: {
        id: string
    },
    Body: {
        value: number
        description: string
    }
}
