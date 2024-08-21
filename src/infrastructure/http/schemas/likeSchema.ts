const createLikeSchema = {
    schema: {
        description: 'Создать лайк',
        tags: ['Like'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                entity_type: { type: 'string' },
                entity_id: { type: 'string' },
                user_id: { type: 'string' },
                type:   { type: 'string' },
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
                            entity_type: { type: 'string' },
                            entity_id: { type: 'string' },
                            user_id: { type: 'string' },
                            type:   { type: 'string' },
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

const getLikesSchema = {
    schema: {
        description: 'Получить список всех лайков',
        tags: ['Like'],
        parameters: {
            id: { type: 'string' },
        },
        query: {
            entity_id: { type: 'string' },
            entity_type: { type: 'string' },
            user_id: { type: 'string' },
            obj_type: { type: 'string' },
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
                                entity_type: {type: 'string'},
                                entity_id: {type: 'string'},
                                user_id: {type: 'string'},
                                type: {type: 'string'},
                                entity: {
                                    type: 'object',
                                    additionalProperties: true
                                }
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

const getByIdLikeSchema = {
    schema: {
        description: 'Получить лайк',
        tags: ['Like'],
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
                            entity_type: { type: 'string' },
                            entity_id: { type: 'string' },
                            user_id: { type: 'string' },
                            type:   { type: 'string' },
                            entity: {
                                type: 'object',
                                additionalProperties: true
                            }
                        },
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

const updateLikeSchema = {
    schema: {
        description: 'Обновить лайк',
        tags: ['Like'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                entity_type: { type: 'string' },
                entity_id: { type: 'string' },
                user_id: { type: 'string' },
                type:   { type: 'string' },
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
                            entity_type: { type: 'string' },
                            entity_id: { type: 'string' },
                            user_id: { type: 'string' },
                            type:   { type: 'string' },
                            entity: {
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

const deleteLikeSchema = {
    schema: {
        description: 'Удалить лайк',
        tags: ['Like'],
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
    createLikeSchema,
    getLikesSchema,
    getByIdLikeSchema,
    updateLikeSchema,
    deleteLikeSchema
}
