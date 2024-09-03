
const getAllReviewSchema = {
    schema: {
        description: 'Получить все отзывы',
        tags: ['Review'],
        query: {
            user_id: {type: 'string'},
            product_id: {type: 'string'},
            old: {type: 'boolean'},
            popular: {type: 'boolean'},
            limit: {type: 'string'},
            offset: {type: 'string'}
        },
        response: {
            200: {
                description: 'Успешное выполнение',
                type: 'object',
                properties: {
                    success: {type: 'boolean'},
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {type: 'string'},
                                images: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: true
                                    }
                                },
                                name: {type: 'string'},
                                rating: {type: 'number'},
                                text: {type: 'string'},
                                created_at: {type: 'string'},
                                published_at: {type: 'string'},
                                product_id: {type: 'string'},
                                product: {
                                    type: 'object',
                                    additionalProperties: true
                                },
                                order_id: {type: 'string'},
                                order: {
                                    type: 'object',
                                    additionalProperties: true
                                },

                            }
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
                },
                500: {
                    description: 'Если все взорвалось',
                    type: 'object',
                    properties: {
                        success: {type: 'boolean'},
                        message: {type: 'string'},
                    }
                }
            }
        }
    }
};


const createReviewSchema = {
    schema: {
        description: 'Создать отзыв',
        tags: ['Review'],
        body: {
            product_id: {type: 'string'},
            name: {type: 'string'},
            rating: {type: 'number'},
            text: {type: 'string'},
            order_id: {type: 'string'}
        },
        response: {
            200: {
                description: 'Успешное выполнение',
                type: 'object',
                properties: {
                    success: {type: 'boolean'},
                    data: {
                        type: 'object',
                        properties: {
                            id: {type: 'string'},
                            name: {type: 'string'},
                            rating: {type: 'number'},
                            text: {type: 'string'},
                            created_at: {type: 'string'},
                            published_at: {type: 'string'},
                            product_id: {type: 'string'},
                            order_id: {type: 'string'},
                        }
                    }
                },
                500: {
                    description: 'Если все взорвалось',
                    type: 'object',
                    properties: {
                        success: {type: 'boolean'},
                        message: {type: 'string'},
                    }
                }
            }
        }
    }
};

export {
    getAllReviewSchema,
    createReviewSchema
}
