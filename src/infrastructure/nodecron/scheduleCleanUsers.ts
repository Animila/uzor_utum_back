import schedule from "node-schedule";
import {deleteInactiveUsers} from "../prisma/functions/checkUser";

export async function setCheckUserSchedule() {
    console.log('Запуск задачи для удаления неактивных пользователей...');
    await deleteInactiveUsers();
    console.log('Задача по удалению неактивных пользователей завершена.');
    schedule.scheduleJob('0 0 * * 0', async () => {
        console.log('Запуск задачи для удаления неактивных пользователей...');
        await deleteInactiveUsers();
        console.log('Задача по удалению неактивных пользователей завершена.');
    });
}
