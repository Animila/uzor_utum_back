import {buildApp, AppOptions} from "./app";
import pino from "pino";
import {rabbit} from "./config/SMTPOptions";
import {setCheckUserSchedule} from "./infrastructure/nodecron/scheduleCleanUsers";
import {setCheckBonusSchedule} from "./infrastructure/nodecron/schedulCheckBonus";

const options: AppOptions = {
    logger: pino({level: 'info'}),
    bodyLimit: 1024 * 1024 * 1024 * 100
}

const start = async () => {
    const app = await buildApp(options)

    await setCheckUserSchedule()
    await setCheckBonusSchedule()

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
