
const createShopSchema = {
    schema: {
        description: 'Создать магазин. Доступно для модераторов и админов',
        tags: ['Shop'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                address: { type: 'string' },
                longitude: { type: 'string' },
                latitude: { type: 'string' },
                email: { type: 'string' },
                phones: {
                    type: 'array',
                    items: { type: 'string' }
                },
                times: { type: 'object', additionalProperties: true },
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
                            id: {type: 'string'},
                            title: { type: 'string' },
                            address: { type: 'string' },
                            longitude: { type: 'string' },
                            latitude: { type: 'string' },
                            email: { type: 'string' },
                            phones: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            times: { type: 'object', additionalProperties: true },
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

const getAllShopSchema = {
    schema: {
        description: 'Получить все магазины',
        tags: ['Shop'],
        response: {
            200: {
                description: 'Успешное выполнение',
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
                                address: { type: 'string' },
                                longitude: { type: 'string' },
                                latitude: { type: 'string' },
                                email: { type: 'string' },
                                phones: {
                                    type: 'array',
                                    items: { type: 'string' }
                                },
                                times: { type: 'object', additionalProperties: true },
                            }
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

const getShopSchema = {
    schema: {
        description: 'Получить магазин',
        tags: ['Shop'],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешное выполнение',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            address: { type: 'string' },
                            longitude: { type: 'string' },
                            latitude: { type: 'string' },
                            email: { type: 'string' },
                            phones: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            times: { type: 'object', additionalProperties: true },
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

const updateShopSchema = {
    schema: {
        description: 'Обновить магазин. Доступно для модераторов и админов',
        tags: ['Shop'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                address: { type: 'string' },
                longitude: { type: 'string' },
                latitude: { type: 'string' },
                email: { type: 'string' },
                phones: {
                    type: 'array',
                    items: { type: 'string' }
                },
                times: { type: 'object', additionalProperties: true },
            },
        },
        response: {
            200: {
                description: 'Успешно обновился',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            address: { type: 'string' },
                            longitude: { type: 'string' },
                            latitude: { type: 'string' },
                            email: { type: 'string' },
                            phones: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            times: { type: 'object', additionalProperties: true },
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

const deleteShopSchema = {
    schema: {
        description: 'Удалить магазин. Доступно для модераторов и админов',
        tags: ['Shop'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешное удаление',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
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
    getAllShopSchema,
    getShopSchema,
    createShopSchema,
    updateShopSchema,
    deleteShopSchema
}