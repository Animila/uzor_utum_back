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
                                entity_type: {type: 'string'},
                                entity_id: {type: 'string'},
                                user_id: {type: 'string'},
                                type: {type: 'string'},
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

export {
    getCartSchema
}