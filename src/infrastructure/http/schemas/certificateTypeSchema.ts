const createCertificateTypeSchema = {
    schema: {
        description: 'Создать номинал сертификата. Доступно для модераторов и админов',
        tags: ['CertificateType'],
        security: [{ApiToken: []}],
        body: {
            type: 'object',
            properties: {
                value: {type: 'number'},
                description: {type: 'string'},
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
                            value: {type: 'number'},
                            description: {type: 'string'},
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

const getAllCertificateTypeSchema = {
    schema: {
        description: 'Получить список всех номиналов',
        tags: ['CertificateType'],
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
                                value: {type: 'number'},
                                description: {type: 'string'},
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

const getByIdCertificateTypeSchema = {
    schema: {
        description: 'Получить номинал сертификата',
        tags: ['CertificateType'],
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
                            value: {type: 'number'},
                            description: {type: 'string'},
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

const updateCertificateTypeSchema = {
    schema: {
        description: 'Ообновить номинал сертификата. Доступно для модераторов и админов',
        tags: ['CertificateType'],
        security: [{ApiToken: []}],
        parameters: {
            id: { type: 'string' },
        },
        body: {
            value: {type: 'number'},
            description: {type: 'string'},
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
                            value: {type: 'number'},
                            description: {type: 'string'},
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

const deleteCertificateTypeSchema = {
    schema: {
        description: 'Удалить номинал. Доступно для модераторов и админов',
        tags: ['CertificateType'],
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
    createCertificateTypeSchema,
    getAllCertificateTypeSchema,
    getByIdCertificateTypeSchema,
    deleteCertificateTypeSchema,
    updateCertificateTypeSchema
}