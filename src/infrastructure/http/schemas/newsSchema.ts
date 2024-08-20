const createNewsSchema = {
    schema: {
        description: 'Создать новость. Доступно для модераторов и админов',
        tags: ['News'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                about: { type: 'string' },
                text: {type: 'string'},
                views: { type: 'number' },
                journal_id: { type: 'string' },
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
                            title: { type: 'string' },
                            about: { type: 'string' },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    additionalProperties: true
                                }
                            },
                            text: {type: 'string'},
                            views: { type: 'number' },
                            journal_id: { type: 'string' },
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

const getAllNewsSchema = {
    schema: {
        description: 'Получить список все новости',
        tags: ['News'],
        query: {
            old: {type: 'string'},
            popular: {type: 'string'},
            journalId: {type: 'string'},
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
                                id: { type: 'string' },
                                title: { type: 'string' },
                                about: { type: 'string' },
                                text: {type: 'string'},
                                views: { type: 'number' },
                                images: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: true
                                    }
                                },
                                journal_id: { type: 'string' },
                                created_at: { type: 'string' },
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

const getByIdNewsSchema = {
    schema: {
        description: 'Получить новость',
        tags: ['News'],
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
                            title: { type: 'string' },
                            about: { type: 'string' },
                            text: {type: 'string'},
                            views: { type: 'number' },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    additionalProperties: true
                                }
                            },
                            journal_id: { type: 'string' },
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

const createViewNewsSchema = {
    schema: {
        description: 'Добавить просмотр',
        tags: ['News'],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно',
                type: 'object',
                properties: {
                    success: { type: 'boolean' }
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
}

const updateNewsSchema = {
    schema: {
        description: 'Обновить новость. Доступно для модераторов и админов',
        tags: ['News'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                about: { type: 'string' },
                text: {type: 'string'},
                views: { type: 'number' },
                journal_id: { type: 'string' }
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
                            title: { type: 'string' },
                            about: { type: 'string' },
                            text: {type: 'string'},
                            views: { type: 'number' },
                            journal_id: { type: 'string' },
                            create_at: { type: 'string' },
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

const deleteNewsSchema = {
    schema: {
        description: 'Удалить новость. Доступно для модераторов и админов',
        tags: ['News'],
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
                            id: { type: 'string' },
                            title: {type: 'string'}
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
    createNewsSchema,
    getAllNewsSchema,
    getByIdNewsSchema,
    updateNewsSchema,
    deleteNewsSchema,
    createViewNewsSchema
}
