const createProductSchema = {
    schema: {
        description: 'Создать продукт. Доступно для модераторов и админов',
        tags: ['Product'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                article: { type: 'string' },
                price: { type: 'number' },
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
                            id: { type: 'string' }
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
                probIds: {
                    type: 'array',
                    items: { type: 'string' },
                },
                decorationIds: {
                    type: 'array',
                    items: { type: 'string' },
                },
                sizeIds: {
                    type: 'array',
                    items: { type: 'string' },
                },
                discount_at: { type: 'boolean'},
                sortBy: { type: 'string' },
                order: { type: 'string' },
                categoryId: { type: 'string' },
                materialId: { type: 'string' },
                q: {type: 'string'},
                minPrice: {type: 'string'},
                maxPrice: {type: 'string'},
                sex: { type: 'string' },
                limit: { type: 'string' },
                updated_at: {type: 'string'},
                created_at: {type: 'string'},
                offset: { type: 'string' },
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
                                sex: { type: 'string' },
                                description: { type: 'string' },
                                details: { type: 'string' },
                                delivery: { type: 'string' },
                                updated_at: {type: 'string'},
                                created_at: {type: 'string'},
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
                                images: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: true
                                    }
                                },
                                review: {
                                    type: 'object',
                                    additionalProperties: true
                                }
                            },
                            required: ['id', 'title']
                        }
                    },
                    pagination: {
                        type: 'object',
                        properties: {
                            totalItems: { type: 'number' },
                            totalPages: { type: 'number' },
                            currentPage: { type: 'number' },
                            limit: { type: 'number' },
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
                            sex: { type: 'string' },
                            description: { type: 'string' },
                            updated_at: {type: 'string'},
                            created_at: {type: 'string'},
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
                            images: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    additionalProperties: true
                                }
                            },
                            review: {
                                type: 'object',
                                additionalProperties: true
                            }
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
        description: 'Обновить продукт. Доступно для модераторов и админов',
        tags: ['Product'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                article: { type: 'string' },
                price: { type: 'number' },
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
                            title: { type: 'string' },
                            article: { type: 'string' },
                            price: { type: 'number' },
                            sex: { type: 'string' },
                            description: { type: 'string' },
                            details: { type: 'string' },
                            delivery: { type: 'string' },
                            available: { type: 'number' },
                            category_id: { type: 'string' },
                            material_id: { type: 'string' },
                            updated_at: {type: 'string'},
                            created_at: {type: 'string'},
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
                            images: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    additionalProperties: true
                                }
                            }
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
        description: 'Удалить продукт. Доступно для модераторов и админов',
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
