const getAllSchema = {
    schema: {
        description: 'Получить всех пользователей. Доступно для модераторов и админов',
        tags: ['User'],
        security: [{ApiToken: []}],
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
                                phone: { type: 'string' },
                                email: { type: 'string' },
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                role: { type: 'string' },
                                bonus: {type: 'number'},
                                accepted_at: { type: 'boolean' },
                                created_at: { type: 'string', format: 'date-time' },
                                updated_at: { type: 'string', format: 'date-time', nullable: true }
                            },
                            required: ['id', 'phone', 'email', 'first_name', 'last_name', 'role', 'accepted_at', 'created_at']
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

const getUserSchema = {
    schema: {
        description: 'Получить пользователя. Доступно для авторизованных',
        tags: ['User'],
        security: [{ApiToken: []}],
        parameters: {
            user_id: { type: 'string' },
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
                            phone: { type: 'string' },
                            email: { type: 'string' },
                            first_name: { type: 'string' },
                            last_name: { type: 'string' },
                            role: { type: 'string' },
                            accepted_at: { type: 'boolean' },
                            bonus: {type: 'number'},
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time', nullable: true }
                        },
                        required: ['id', 'phone', 'email', 'first_name', 'last_name', 'role', 'accepted_at', 'created_at']
                    }
                }
            },
            404: {
                description: 'Если такого пользователя нет',
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

const updateUserSchema = {
    schema: {
        description: 'Обновить пользователя. Доступно для авторизованных',
        tags: ['User'],
        security: [{ApiToken: []}],
        parameters: {
            user_id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                phone: { type: 'string' },
                email: { type: 'string' },
                role: {type: 'string'}
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
                            phone: { type: 'string' },
                            email: { type: 'string' },
                            first_name: { type: 'string' },
                            last_name: { type: 'string' },
                            role: { type: 'string' },
                            accepted_at: { type: 'boolean' },
                            bonus: {type: 'number'},
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time', nullable: true }
                        }
                    }
                }
            },
            400: {
                description: 'Если есть проблемы с данными',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                type: { type: 'string' },
                                message: { type: 'string' },
                            }
                        }
                    }
                }
            },
            404: {
                description: 'Если такого пользователя нет',
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

const deleteUserSchema = {
    schema: {
        description: 'Удалить пользователя. Доступно для модераторов и админов',
        tags: ['User'],
        security: [{ApiToken: []}],
        parameters: {
            user_id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешное удаление',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                }
            },
            404: {
                description: 'Если такого пользователя нет',
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

export {
    getAllSchema,
    getUserSchema,
    updateUserSchema,
    deleteUserSchema
}
