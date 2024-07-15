import {User} from "../../../domain/user/user";

const registerSchema = {
    schema: {
        description: 'Регистрация пользователей',
        tags: ['Auth'],
        body: {
            type: 'object',
            properties: {
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                phone: { type: 'string' },
                email: { type: 'string' },
            },
        },
        response: {
            200: {
                description: 'Успешно создано',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                        }
                    }
                }
            },
            409: {
                description: 'Если телефон или почта уже существует',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
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

const loginSchema = {
    schema: {
        description: 'Авторизация по номеру',
        tags: ['Auth'],
        body: {
            type: 'object',
            properties: {
                phone: { type: 'string' },
            },
        },
        response: {
            200: {
                description: 'Код успешно отправлен',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        additionalProperties: true, // Разрешает любые свойства
                    },
                }
            },
            404: {
                description: 'Если такого номера нет',
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

const checkAuth = {
    schema: {
        description: 'Проверка авторизации',
        tags: ['Auth'],
        security: [{ApiToken: []}],
        response: {
            200: {
                description: 'Все успешно',
                type: 'object',
                properties: {
                    success: {type: 'boolean'},
                    data: {
                        user_id: {type: 'number'},
                    },
                }
            },
            401: {
                description: 'Не авторизован',
                type: 'object',
            },
        }
    }
}

const verifySchema = {
    schema: {
        description: 'Потверждение кода',
        tags: ['Auth'],
        body: {
            type: 'object',
            properties: {
                code: { type: 'number' },
            },
        },
        response: {
            200: {
                description: 'Код успешно отправлен',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        code: { type: 'number' },
                    },
                }
            },
            404: {
                description: 'Если такого номера нет',
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
    registerSchema,
    loginSchema,
    verifySchema,
    checkAuth
}