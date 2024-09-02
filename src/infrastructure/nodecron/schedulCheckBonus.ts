import schedule from "node-schedule";
import {deleteInactiveUsers} from "../prisma/functions/checkUser";
import {createMinusBonuses} from "../prisma/functions/checkBonuses";

export async function setCheckBonusSchedule() {
    console.log('Запуск задачи для проверки бонусов...');
    await createMinusBonuses();
    console.log('Задача по проверке бонусов завершена.');
    schedule.scheduleJob('0 0 * * *', async () => {
        console.log('Запуск задачи для проверки бонусов...');
        await createMinusBonuses();
        console.log('Задача по проверке бонусов завершена.');
    });
}
