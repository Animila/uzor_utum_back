import {User} from "../../../domain/user/user";

const registerSchema = {
    schema: {
        description: 'Регистрация пользователей',
        tags: ['Auth'],
        // params: {
        //     type: 'object',
        //     properties: {
        //         id: { type: 'string' }
        //     },
        //     required: ['id']
        // },
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
            }
        }
    }
};

export {
    registerSchema
}