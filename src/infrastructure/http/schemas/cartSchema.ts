const getCartSchema = {
    schema: {
        description: 'Получить или создать корзину. Отправляешь id пользователя или сохраненный токен в куки по query и получаешь либо созданную новую корзину или уже существующую',
        tags: ['Cart'],
        query: {
            token: { type: 'string' },
            user_id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {type: 'string'},
                                user_id: {type: 'string'},
                                token: {type: 'string'},
                                total_amount: {type: 'number'},
                                created_at: {type: 'string'},
                                updated_at: {type: 'string'},
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: {type: 'string'},
                                            product_id: {type: 'string'},
                                            size_id: {type: 'string'},
                                            decorate_id: {type: 'string'},
                                            proba_id: {type: 'string'},
                                            cart_id: {type: 'string'},
                                            count: {type: 'number'},
                                            updated_at: {type: 'string'},
                                            created_at: {type: 'string'}
                                        }
                                    }
                                }
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

const addItemToCart = {
    schema: {
        description: 'Добавить новый товар в корзину',
        tags: ['Cart'],
        query: {
            token: { type: 'string' },
        },
        body: {
            product_id: {type: 'string'},
            proba_id: {type: 'string'},
            decorate_id: {type: 'string'},
            size_id: {type: 'string'},
            count: {type: 'number'},
        },
        response: {
            200: {
                description: 'Успешно',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: {type: 'string'},
                            product_id: {type: 'string'},
                            proba_id: {type: 'string'},
                            decorate_id: {type: 'string'},
                            size_id: {type: 'string'},
                            cart_id: {type: 'string'},
                            count: {type: 'number'},
                            updated_at: {type: 'string'},
                            created_at: {type: 'string'}
                        },
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

const changeItemCart = {
    schema: {
        description: 'Изменить товар в корзине',
        tags: ['Cart'],
        query: {
            id: { type: 'string' },
        },
        body: {
            proba_id: {type: 'string'},
            decorate_id: {type: 'string'},
            size_id: {type: 'string'},
            count: {type: 'number'},
        },
        response: {
            200: {
                description: 'Успешно',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: {type: 'string'},
                            product_id: {type: 'string'},
                            size_id: {type: 'string'},
                            decorate_id: {type: 'string'},
                            proba_id: {type: 'string'},
                            cart_id: {type: 'string'},
                            count: {type: 'number'},
                            updated_at: {type: 'string'},
                            created_at: {type: 'string'}
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

const removeItemCart = {
    schema: {
        description: 'Удалить товар из корзины',
        tags: ['Cart'],
        query: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно',
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
    getCartSchema,
    addItemToCart,
    changeItemCart,
    removeItemCart

}