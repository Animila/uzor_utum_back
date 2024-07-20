interface DiscountRequest {
    Params: {
        id: string,
        product_id: string
    },
    Body: {
        product_id: string;
        percentage: number;
        start_date: Date;
        end_date: Date;
        activated: boolean;
    };
}
