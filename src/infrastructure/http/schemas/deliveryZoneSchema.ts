
const createDeliveryZoneSchema = {
    schema: {
        description: 'Создать зону доставки. Доступно для модераторов и админов',
        tags: ['DeliveryZone'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                polygon: { type: 'object', additionalProperties: true },
                price: {type: 'number'}
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
                            description: { type: 'string' },
                            polygon: { type: 'object', additionalProperties: true },
                            price: {type: 'number'}
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

const getAllDeliveryZoneSchema = {
    schema: {
        description: 'Получить все зоны',
        tags: ['DeliveryZone'],
        query: {
            limit: {type: 'string'},
            offset: {type: 'string'}
        },
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
                                description: { type: 'string' },
                                polygon: { type: 'object', additionalProperties: true },
                                price: {type: 'number'}
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

const getDeliveryZoneSchema = {
    schema: {
        description: 'Получить зону',
        tags: ['DeliveryZone'],
        parameters: {
            id: { type: 'string' },
        },
        query: {
            limit: {type: 'string'},
            offset: {type: 'string'}
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
                            description: { type: 'string' },
                            polygon: { type: 'object', additionalProperties: true },
                            price: {type: 'number'}
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

const updateDeliveryZoneSchema = {
    schema: {
        description: 'Обновить зону. Доступно для модераторов и админов',
        tags: ['DeliveryZone'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                polygon: { type: 'object', additionalProperties: true },
                price: {type: 'number'}
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
                            description: { type: 'string' },
                            polygon: { type: 'object', additionalProperties: true },
                            price: {type: 'number'}
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

const deleteDeliveryZoneSchema = {
    schema: {
        description: 'Удалить зону. Доступно для модераторов и админов',
        tags: ['DeliveryZone'],
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
    getAllDeliveryZoneSchema,
    getDeliveryZoneSchema,
    createDeliveryZoneSchema,
    updateDeliveryZoneSchema,
    deleteDeliveryZoneSchema
}
