interface AuthRequest {
    Body: {
        first_name: string,
        last_name: string,
        email: string,
        phone: string,
        code: string
    };
}

interface UserRequest {
    Body: {
        first_name: string,
        last_name: string,
        email: string,
        phone: string
    };
}