const createBonusSchema = {
    schema: {
        description: 'Создать бонус (при заказе будет локально создаваться)',
        tags: ['Bonus'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                type: { type: 'string' },
                description: { type: 'string' },
                count: { type: 'number' },
                user_id: { type: 'string' },
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
                            type: { type: 'string' },
                            description: { type: 'string' },
                            count: { type: 'number' },
                            user_id: { type: 'string' },
                            created_at: { type: 'string' },
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

const getBonusesSchema = {
    schema: {
        description: 'Получить список всех бонусов',
        tags: ['Bonus'],
        security: [{ApiToken: []}],
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
                                type: { type: 'string' },
                                description: { type: 'string' },
                                count: { type: 'number' },
                                user_id: { type: 'string' },
                                created_at: { type: 'string' },
                            },
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

const getByIdBonusSchema = {
    schema: {
        description: 'Получить бонус',
        tags: ['Bonus'],
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
                            type: { type: 'string' },
                            description: { type: 'string' },
                            count: { type: 'number' },
                            user_id: { type: 'string' },
                            created_at: { type: 'string' },
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

const getUserBonusesSchema = {
    schema: {
        description: 'Проверить бонусы пользователя',
        tags: ['Bonus'],
        params: {
            user_id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно получен',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {type: 'string'},
                                type: { type: 'string' },
                                description: { type: 'string' },
                                count: { type: 'number' },
                                user_id: { type: 'string' },
                                created_at: { type: 'string' },
                            },
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

const getUserSumBonusesSchema = {
    schema: {
        description: 'Получить сумму бонусов пользователей',
        tags: ['Bonus'],
        params: {
            user_id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно получен',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: { type: 'number' },
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

const updateBonusSchema = {
    schema: {
        description: 'Обновить бонус',
        tags: ['Bonus'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                type: { type: 'string' },
                description: { type: 'string' },
                count: { type: 'number' },
                user_id: { type: 'string' },
                created_at: { type: 'string' },
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
                            type: { type: 'string' },
                            description: { type: 'string' },
                            count: { type: 'number' },
                            user_id: { type: 'string' },
                            created_at: { type: 'string' },
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

const deleteBonusSchema = {
    schema: {
        description: 'Удалить бонус',
        tags: ['Bonus'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно удалено',
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
    createBonusSchema,
    getBonusesSchema,
    getByIdBonusSchema,
    updateBonusSchema,
    deleteBonusSchema,
    getUserBonusesSchema,
    getUserSumBonusesSchema
}