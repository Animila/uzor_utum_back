interface CategoryRequest {
    Query: {
        limit: string,
        offset: string,
    }
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}
interface MaterialRequest {
    Query: {
        limit: string,
        offset: string,
    }
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}
interface DecorateRequest {
    Query: {
        limit: string,
        offset: string,
    }
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}
interface SizeRequest {
    Query: {
        limit: string,
        offset: string,
    }
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}
interface ProbRequest {
    Query: {
        limit: string,
        offset: string,
    }
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
        probIds?: string[];
        decorationIds?: string[];
        sizeIds?: string[];
        sortBy?: string;
        sex?: string;
        order?: "asc" | "desc";
        categoryId?: string;
        materialId?: string;
        q?: string
        minPrice?: string,
        maxPrice?: string,
        limit: string,
        offset: string,
        discount_at: boolean
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
        category_id: string;
        material_id: string;
        prob_ids: string[];
        decoration_ids: string[];
        size_ids: string[];
    }
}

