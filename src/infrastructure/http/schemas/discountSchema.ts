const createDiscountSchema = {
    schema: {
        description: 'Создать скидки. Доступно для модераторов и админов',
        tags: ['Discount'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                product_id: { type: 'string' },
                percentage: { type: 'number' },
                start_date: { type: 'string' },
                end_date:   { type: 'string' },
                activated:  { type: 'boolean'}
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
                            product_id: { type: 'string' },
                            percentage: { type: 'number' },
                            start_date: { type: 'string' },
                            end_date:   { type: 'string' },
                            activated:  { type: 'boolean'}
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

const getByIdProductDiscountSchema = {
    schema: {
        description: 'Получить список всех скидок',
        tags: ['Discount'],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно получены',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            product_id: { type: 'string' },
                            percentage: { type: 'number' },
                            start_date: { type: 'string' },
                            end_date:   { type: 'string' },
                            activated:  { type: 'boolean'}
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

const getByIdDiscountSchema = {
    schema: {
        description: 'Получить скидку',
        tags: ['Discount'],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно получен',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            product_id: { type: 'string' },
                            percentage: { type: 'number' },
                            start_date: { type: 'string' },
                            end_date:   { type: 'string' },
                            activated:  { type: 'boolean'}
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

const updateDiscountSchema = {
    schema: {
        description: 'Обновить скидки. Доступно для модераторов и админов',
        tags: ['Discount'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                product_id: { type: 'string' },
                percentage: { type: 'number' },
                start_date: { type: 'string' },
                end_date:   { type: 'string' },
                activated:  { type: 'boolean'}
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
                            product_id: { type: 'string' },
                            percentage: { type: 'number' },
                            start_date: { type: 'string' },
                            end_date:   { type: 'string' },
                            activated:  { type: 'boolean'}
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

const deleteDiscountSchema = {
    schema: {
        description: 'Удалить скидку. Доступно для модераторов и админов',
        tags: ['Discount'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно удалить',
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

export {
    createDiscountSchema,
    getByIdProductDiscountSchema,
    getByIdDiscountSchema,
    updateDiscountSchema,
    deleteDiscountSchema
}