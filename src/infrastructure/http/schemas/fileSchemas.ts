const loadFileSchema = {
    schema: {
        description: 'Загрузить файл. Для авторизованных. ЛУЧШЕ ГРУЗИТЬ ЧЕРЕЗ formdata, swagger не смог нормально отрендерить',
        tags: ['File'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                entity_type: { type: 'string' },
                entity_id: { type: 'string' },
                files: { type: 'object' },
            },
            required: ['files']
        },
        response: {
            200: {
                description: 'Успешно сохранено',
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

const getFilesSchema = {
    schema: {
        description: 'Получить файлы. Открывать по /public/...',
        tags: ['File'],
        query: {
            limit: {type: 'string'},
            offset: {type: 'string'}
        },
        params: {
            entity_type: { type: 'string' },
            entity_id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно получено',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                entity_type: { type: 'string' },
                                entity_id: { type: 'string' },
                                name: { type: 'string' },
                                type_file: { type: 'string' },
                                path: { type: 'string' }
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

const deleteFileSchema = {
    schema: {
        description: 'Получить файлы. Открывать по /public/...',
        security: [{ApiToken: []}],
        tags: ['File'],
        params: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно получено',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                entity_type: { type: 'string' },
                                entity_id: { type: 'string' },
                                name: { type: 'string' },
                                type_file: { type: 'string' },
                                path: { type: 'string' }
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

export {
    loadFileSchema,
    getFilesSchema,
    deleteFileSchema
}
