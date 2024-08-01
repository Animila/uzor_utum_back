const getOrdersSchema = {
    schema: {
        description: 'Получить все заказы',
        tags: ['Order'],
        query: {
            user_id: {type:'string'},
            token: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            total_amount: { type: 'string' },
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
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                phone: { type: 'string' },
                                email: { type: 'string' },
                                send_type_id: { type: 'string' },
                                address: { type: 'string' },
                                house: {type: 'string'},
                                apartment: { type: 'string' },
                                postal_code: { type: 'number' },
                                office: { type: 'string' },
                                delivery_at: { type: 'string' },
                                shop_id: { type: 'string' },
                                comment: { type: 'string' },
                                receiver_id: { type: 'string' },
                                payment_id: {type: 'string'},
                                certificate_id: { type: 'string' },
                                promocode_id: { type: 'string' },
                                add_bonus: { type: 'number' },
                                use_bonus: { type: 'number' },
                                total_amount: {type: 'number'},
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: true
                                    }
                                },
                                user_id: {type: 'string'},
                                token: {type: 'string'},
                                created_at: {type: 'string'},
                                updated_at: {type: 'string'},
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

const getOrderSchema = {
    schema: {
        description: 'Получить заказ по id',
        tags: ['Order'],
        params: {
            id: { type: 'string' },
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
                            first_name: { type: 'string' },
                            last_name: { type: 'string' },
                            phone: { type: 'string' },
                            email: { type: 'string' },
                            send_type_id: { type: 'string' },
                            address: { type: 'string' },
                            house: {type: 'string'},
                            apartment: { type: 'string' },
                            postal_code: { type: 'number' },
                            office: { type: 'string' },
                            delivery_at: { type: 'string' },
                            shop_id: { type: 'string' },
                            comment: { type: 'string' },
                            receiver_id: { type: 'string' },
                            payment_id: {type: 'string'},
                            certificate_id: { type: 'string' },
                            promocode_id: { type: 'string' },
                            add_bonus: { type: 'number' },
                            use_bonus: { type: 'number' },
                            total_amount: {type: 'number'},
                            items: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    additionalProperties: true
                                }
                            },
                            user_id: {type: 'string'},
                            token: {type: 'string'},
                            created_at: {type: 'string'},
                            updated_at: {type: 'string'},
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

const createOrderSchema = {
    schema: {
        description: 'Создать новый заказ',
        tags: ['Order'],
        body: {
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            send_type_id: { type: 'string' },
            address: { type: 'string' },
            house: {type: 'string'},
            apartment: { type: 'string' },
            postal_code: { type: 'number' },
            office: { type: 'string' },
            delivery_at: { type: 'string' },
            shop_id: { type: 'string' },
            comment: { type: 'string' },
            receiver_id: { type: 'string' },
            certificate_id: { type: 'string' },
            promocode_id: { type: 'string' },
            add_bonus: { type: 'number' },
            use_bonus: { type: 'number' },
            total_amount: {type: 'number'},
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    additionalProperties: true
                }
            },
            user_id: {type: 'string'},
            token: {type: 'string'},
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
                            url_confirm: { type: 'string' }
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

const deleteOrderSchema = {
    schema: {
        description: 'Удалить заказ',
        tags: ['Order'],
        params: {
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
    getOrdersSchema,
    getOrderSchema,
    createOrderSchema,
    deleteOrderSchema

}