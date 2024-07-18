interface CategoryRequest {
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}
interface MaterialRequest {
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}

interface ProductRequest {
    Params: {
        id: string
    },
    Query: {
        filters?: string;
        sortBy?: string
        order?: "asc" | "desc";
        categoryId?: string;
        materialId?: string;
        q?: string
        minPrice?: string,
        maxPrice?: string
    },
    Body: {
        title: string;
        article: string;
        price: number;
        path_images: string[];
        sex: string;
        description: string;
        details: string;
        delivery: string;
        attributes: JSON;
        available: number;
        categoryId: string;
        materialId: string;
    }
}

