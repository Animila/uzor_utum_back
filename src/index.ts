import {buildApp, AppOptions} from "./app";
import pino from "pino";
import {rabbit} from "./config/SMTPOptions";

const options: AppOptions = {
    logger: pino({level: 'info'}),
    bodyLimit: 1024 * 1024 * 100
}

const start = async () => {
    const app = await buildApp(options)

    try {
        await app.listen({
            port: 3000,
            host: '0.0.0.0'
        })
    } catch (error) {
        app.log.error(error)
        await rabbit.closeConnection()
        process.exit(1)
    }
}

start().then(r => console.log('Успешный запуск'))
