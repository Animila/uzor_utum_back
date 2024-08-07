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
interface DecorateRequest {
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}
interface SizeRequest {
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}
interface ProbRequest {
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
        category_id: string;
        material_id: string;
        prob_ids: string[];
        decoration_ids: string[];
        size_ids: string[];
    }
}

