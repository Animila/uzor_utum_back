const registerSchema = {
    schema: {
        description: 'Регистрация пользователя (после чего сразу же будет выслан код подтверждения)',
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
                description: 'Пользователь успешно был создан',
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
        description: 'Аутентификация по номеру телефона. После ввода будет выслан код',
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
        description: 'Авторизация, получение идентификатора и роли',
        tags: ['Auth'],
        security: [{ApiToken: []}],
        response: {
            200: {
                description: 'Все успешно',
                type: 'object',
                properties: {
                    success: {type: 'boolean'},
                    data: {
                        type: 'object',
                        properties: {
                            user_id: {type: 'string'},
                            role: {type: 'string'},
                        }
                    },
                }
            },
            401: {
                description: 'Не авторизован',
                type: 'object',
            },
            403: {
                description: 'Не имеешь право доступа',
                type: 'object',
            },
        }
    }
}

const verifySchema = {
    schema: {
        description: 'Подтверждение одноразового кода. После этого вернется токен доступа',
        tags: ['Auth'],
        body: {
            type: 'object',
            properties: {
                code: { type: 'string' },
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
                        properties: {
                            token: {type: 'string'},
                        }
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