const createPromoCodeSchema = {
    schema: {
        description: 'Создать промокод. Доступно для модераторов и админов',
        tags: ['PromoCode'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                code: { type: 'string' },
                description: { type: 'string' },
                active: { type: 'boolean' },
                discount: { type: 'number' },
                valid_from: { type: 'string' },
                valid_to: { type: 'string' }
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
                            code: { type: 'string' },
                            description: { type: 'string' },
                            active: { type: 'boolean' },
                            discount: { type: 'number' },
                            valid_from: { type: 'string' },
                            valid_to: { type: 'string' }
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

const getPromoCodesSchema = {
    schema: {
        description: 'Получить список всех промокодов. Доступно для модераторов и админов',
        tags: ['PromoCode'],
        security: [{ApiToken: []}],
        query: {
            limit: {type: 'string'},
            offset: {type: 'string'}
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
                                id: {type: 'string'},
                                code: { type: 'string' },
                                description: { type: 'string' },
                                active: { type: 'boolean' },
                                discount: { type: 'number' },
                                valid_from: { type: 'string' },
                                valid_to: { type: 'string' }
                            },
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

const getByIdPromoCodeSchema = {
    schema: {
        description: 'Получить промокод. Доступно для модераторов и админов',
        tags: ['PromoCode'],
        security: [{ApiToken: []}],
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
                            code: { type: 'string' },
                            description: { type: 'string' },
                            active: { type: 'boolean' },
                            discount: { type: 'number' },
                            valid_from: { type: 'string' },
                            valid_to: { type: 'string' }
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

const checkPromoCodeSchema = {
    schema: {
        description: 'Проверить промокод',
        tags: ['PromoCode'],
        query: {
            email: {type: 'string'},
            phone: {type: 'string'},
            user_id: {type: 'string'},
        },
        body: {
            code: { type: 'string' },
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
                            code: { type: 'string' },
                            description: { type: 'string' },
                            active: { type: 'boolean' },
                            discount: { type: 'number' },
                            valid_from: { type: 'string' },
                            valid_to: { type: 'string' }
                        },
                    }
                }
            },
            404: {
                description: 'Если не нашлось',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
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

const updatePromoCodeSchema = {
    schema: {
        description: 'Обновить промокод. Доступно для модераторов и админов',
        tags: ['PromoCode'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                code: { type: 'string' },
                description: { type: 'string' },
                active: { type: 'boolean' },
                discount: { type: 'number' },
                valid_from: { type: 'string' },
                valid_to: { type: 'string' }
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
                            code: { type: 'string' },
                            description: { type: 'string' },
                            active: { type: 'boolean' },
                            discount: { type: 'number' },
                            valid_from: { type: 'string' },
                            valid_to: { type: 'string' }
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

const deletePromoCodeSchema = {
    schema: {
        description: 'Удалить промокод. Доступно для модераторов и админов',
        tags: ['PromoCode'],
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
    createPromoCodeSchema,
    getPromoCodesSchema,
    getByIdPromoCodeSchema,
    updatePromoCodeSchema,
    deletePromoCodeSchema,
    checkPromoCodeSchema
}
