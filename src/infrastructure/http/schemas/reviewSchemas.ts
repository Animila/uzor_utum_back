
const getAllReviewSchema = {
    schema: {
        description: 'Получить все отзывы',
        tags: ['Review'],
        querystring: {
            type: 'object',
            properties: {
                user_id: {type: 'string'},
                product_id: {type: 'string'},
                old: {type: 'boolean'},
                popular: {type: 'boolean'},
            },
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
                                        properties: {
                                            additionalProperties: true
                                        },
                                    }
                                },
                                name: {type: 'string'},
                                url: {type: 'string'},
                                rating: {type: 'number'},
                                text: {type: 'string'},
                                created_at: {type: 'string'},
                                published_at: {type: 'string'},
                                product_id: {type: 'string'},
                                order_id: {type: 'string'},
                            }
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
            url: {type: 'string'},
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
                            url: {type: 'string'},
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
