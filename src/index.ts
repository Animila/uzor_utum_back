import {buildApp, AppOptions} from "./app";
import pino from "pino";

const options: AppOptions = {
    logger: pino({level: 'info'})
}

const start = async () => {
    const app = await buildApp(options)

    try {
        await app.listen({
            port: 3000,
            host: 'localhost'
        })
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()