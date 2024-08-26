import schedule from 'node-schedule'
export function scheduleSendEmail(date: Date, reminders: string[] | undefined, sendData: () => void) {

    // Устанавливаем cron задачу на отправку уведомления в указанное время
    console.log(date)
    console.log(new Date())
    schedule.scheduleJob(date.toString(), () => {
        console.log('отправка сертификата')
        sendData()
    });

    // Проверяем, есть ли предварительные напоминания
    if (reminders && reminders.length > 0) {
        // Для каждого предварительного напоминания создаем отдельную задачу
        reminders.forEach((reminder) => {
            const [value, unit] = reminder.split(' ');
            // Создаем новую дату на основе основной даты
            const reminderDate = new Date(date);
            // Изменяем значение даты в соответствии с предварительным напоминанием
            switch (unit) {
                case 'year':
                case 'years':
                    reminderDate.setFullYear(reminderDate.getFullYear() - parseInt(value));
                    break;
                case 'month':
                case 'months':
                    reminderDate.setMonth(reminderDate.getMonth() - parseInt(value));
                    break;
                case 'week':
                case 'weeks':
                    reminderDate.setDate(reminderDate.getDate() - parseInt(value) * 7);
                    break;
                case 'day':
                case 'days':
                    reminderDate.setDate(reminderDate.getDate() - parseInt(value));
                    break;
                case 'hour':
                case 'hours':
                    reminderDate.setHours(reminderDate.getHours() - parseInt(value));
                    break;
                case 'minute':
                case 'minutes':
                    reminderDate.setMinutes(reminderDate.getMinutes() - parseInt(value));
                    break;
                case 'second':
                case 'seconds':
                    reminderDate.setSeconds(reminderDate.getSeconds() - parseInt(value));
                    break;
                default:
                    throw new Error('Invalid reminder unit');
            }
            // Устанавливаем задачу для напоминания
            schedule.scheduleJob(reminderDate, () => {
                console.log(`Reminder ${reminder}`);
                sendData();
            });
        });
    }
}
