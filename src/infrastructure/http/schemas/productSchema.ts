const createProductSchema = {
    schema: {
        description: 'Создать продукт',
        tags: ['Product'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                article: { type: 'string' },
                price: { type: 'number' },
                path_images: { type: 'array', items: { type: 'string' } },
                sex: { type: 'string' },
                description: { type: 'string' },
                details: { type: 'string' },
                delivery: { type: 'string' },
                prob_ids: {
                    type: 'array',
                    items: { type: 'string' },
                },
                decoration_ids: {
                    type: 'array',
                    items: { type: 'string' },
                },
                size_ids: {
                    type: 'array',
                    items: { type: 'string' },
                },
                available: { type: 'number' },
                category_id: { type: 'string' },
                material_id: { type: 'string' },
            },
        },
        response: {
            200: {
                description: 'Успешно создан',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: {type: 'string'}
                        },
                    }
                }
            },
            500: {
                description: 'Если все взорвалось',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                }
            }
        }
    }
};

const getAllProductSchema = {
    schema: {
        description: 'Получить список всех продуктов',
        tags: ['Product'],
        querystring: {
            type: 'object',
            properties: {
                filters: { type: 'string' },
                sortBy: { type: 'string' },
                order: { type: 'string' },
                categoryId: { type: 'string' },
                materialId: { type: 'string' },
                q: {type: 'string'},
                minPrice: {type: 'string'},
                maxPrice: {type: 'string'},
            },
        },
        response: {
            200: {
                description: 'Успешно получены',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                title: { type: 'string' },
                                article: { type: 'string' },
                                price: { type: 'number' },
                                path_images: { type: 'array', items: { type: 'string' } },
                                sex: { type: 'string' },
                                description: { type: 'string' },
                                details: { type: 'string' },
                                delivery: { type: 'string' },
                                prob_ids: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                                decoration_ids: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                                size_ids: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                                available: { type: 'number' },
                                category_id: { type: 'string' },
                                material_id: { type: 'string' },
                                discount: { type: 'object', additionalProperties: true },
                            },
                            required: ['id', 'title']
                        }
                    }
                }
            },
            500: {
                description: 'Если все взорвалось',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                }
            }
        }
    }
};

const getByIdProductSchema = {
    schema: {
        description: 'Получить продукт',
        tags: ['Product'],
        response: {
            200: {
                description: 'Успешно получен',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            article: { type: 'string' },
                            price: { type: 'number' },
                            path_images: { type: 'array', items: { type: 'string' } },
                            sex: { type: 'string' },
                            description: { type: 'string' },
                            details: { type: 'string' },
                            delivery: { type: 'string' },
                            prob_ids: {
                                type: 'array',
                                items: { type: 'string' },
                            },
                            decoration_ids: {
                                type: 'array',
                                items: { type: 'string' },
                            },
                            size_ids: {
                                type: 'array',
                                items: { type: 'string' },
                            },
                            available: { type: 'number' },
                            category_id: { type: 'string' },
                            material_id: { type: 'string' },
                            discount: { type: 'object', additionalProperties: true },
                        },
                    }
                }
            },
            500: {
                description: 'Если все взорвалось',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                }
            }
        }
    }
};

const updateProductSchema = {
    schema: {
        description: 'Обновить продукт',
        tags: ['Product'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                article: { type: 'string' },
                price: { type: 'number' },
                path_images: { type: 'array', items: { type: 'string' } },
                sex: { type: 'string' },
                description: { type: 'string' },
                details: { type: 'string' },
                delivery: { type: 'string' },
                available: { type: 'number' },
                category_id: { type: 'string' },
                material_id: { type: 'string' },
                prob_ids: {
                    type: 'array',
                    items: { type: 'string' },
                },
                decoration_ids: {
                    type: 'array',
                    items: { type: 'string' },
                },
                size_ids: {
                    type: 'array',
                    items: { type: 'string' },
                },
            },
        },
        response: {
            200: {
                description: 'Успешно обновлен',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: {type: 'string'}
                        },
                    }
                }
            },
            500: {
                description: 'Если все взорвалось',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                }
            }
        }
    }
};

const deleteProductSchema = {
    schema: {
        description: 'Удалить продукт',
        tags: ['Product'],
        security: [{ApiToken: []}],
        response: {
            200: {
                description: 'Успешно удалить',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: {type: 'string'}
                        },
                    }
                }
            },
            500: {
                description: 'Если все взорвалось',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                }
            }
        }
    }
};

export {
    createProductSchema,
    getAllProductSchema,
    getByIdProductSchema,
    updateProductSchema,
    deleteProductSchema
}