
const createReceiverSchema = {
    schema: {
        description: 'Создать получателя',
        tags: ['Receiver'],
        body: {
            type: 'object',
            properties: {
                token: { type: 'string' },
                full_name: { type: 'string' },
                phone: { type: 'string' },
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
                            token: { type: 'string' },
                            full_name: { type: 'string' },
                            phone: { type: 'string' },
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

const getAllReceiverSchema = {
    schema: {
        description: 'Получить всех получателей',
        tags: ['Receiver'],
        query: {
            token: { type: 'string' },
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
                                token: { type: 'string' },
                                full_name: { type: 'string' },
                                phone: { type: 'string' },
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

const getReceiverSchema = {
    schema: {
        description: 'Получить получателя',
        tags: ['Receiver'],
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
                            token: { type: 'string' },
                            full_name: { type: 'string' },
                            phone: { type: 'string' },
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

const updateReceiverSchema = {
    schema: {
        description: 'Обновить получателя',
        tags: ['Receiver'],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                token: { type: 'string' },
                full_name: { type: 'string' },
                phone: { type: 'string' },
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
                            token: { type: 'string' },
                            full_name: { type: 'string' },
                            phone: { type: 'string' },
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

const deleteReceiverSchema = {
    schema: {
        description: 'Удалить получателя',
        tags: ['Receiver'],
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
    getAllReceiverSchema,
    getReceiverSchema,
    createReceiverSchema,
    updateReceiverSchema,
    deleteReceiverSchema
}