import {Phone} from "../../../domain/certificate/valueObjects/phone";
import {Email} from "../../../domain/certificate/valueObjects/email";

const createCertificateSchema = {
    schema: {
        description: 'Создать сертификат',
        tags: ['Certificate'],
        body: {
            type: 'object',
            properties: {
                phone: { type: 'string' },
                email: { type: 'string' },
                accepted: { type: 'boolean' },
                delivery_at: { type: 'string' },
                user_id: { type: 'string' },
                certificate_type_id: { type: 'string' }
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
                            url_confirm: { type: 'string' }
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

const getAllCertificateSchema = {
    schema: {
        description: 'Получить список всех сертификатов. Доступно для модераторов и админов',
        tags: ['Certificate'],
        security: [{ApiToken: []}],
        query: {
            certificate_type_id: { type: 'string' }
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
                                id: {type: 'string'},
                                phone: { type: 'string' },
                                email: { type: 'string' },
                                accepted: { type: 'boolean' },
                                delivery_at: { type: 'string' },
                                user_id: { type: 'string' },
                                code: { type: 'string' },
                                activated: { type: 'boolean' },
                                certificate_type_id: { type: 'string' },
                                orderId: { type: 'string' }
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

const checkCertificateSchema = {
    schema: {
        description: 'Проверить сертификат',
        tags: ['Certificate'],
        query: {
            code: { type: 'string' }
        },
        response: {
            200: {
                description: 'Успешно получены',
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            id: {type: 'string'},
                            phone: { type: 'string' },
                            email: { type: 'string' },
                            accepted: { type: 'boolean' },
                            delivery_at: { type: 'string' },
                            user_id: { type: 'string' },
                            code: { type: 'string' },
                            certificate_type: {
                                type: 'object',
                                additionalProperties: true
                            },
                            activated: { type: 'boolean' },
                            certificate_type_id: { type: 'string' },
                            orderId: { type: 'string' }
                        },
                    }
                }
            },
            404: {
                description: 'Если нет такого сертификата',
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

const getByIdCertificateSchema = {
    schema: {
        description: 'Получить сертифкат',
        tags: ['Certificate'],
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
                            id: {type: 'string'},
                            phone: { type: 'string' },
                            email: { type: 'string' },
                            accepted: { type: 'boolean' },
                            delivery_at: { type: 'string' },
                            user_id: { type: 'string' },
                            code: { type: 'string' },
                            activated: { type: 'boolean' },
                            certificate_type_id: { type: 'string' },
                            orderId: { type: 'string' }
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

const deleteCertificateSchema = {
    schema: {
        description: 'Удалить сертификат. Доступно для модераторов и админов',
        tags: ['Certificate'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        response: {
            200: {
                description: 'Успешно удалить',
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

export {
    createCertificateSchema,
    checkCertificateSchema,
    getAllCertificateSchema,
    getByIdCertificateSchema,
    deleteCertificateSchema
}
