
export const swaggerOptions = {
    swagger: {
        info: {
            title: 'Uzor Utum API',
            description: 'API документация',
            version: '0.1.0'
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
    }
}

export const swaggerUIOptions = {
    routePrefix: '/documentation',
    uiConfig: {
        deepLinking: false
    },

}