import SMTPMail from "../../infrastructure/smtp/SMTPMail";
import {Mail} from "../../domain/mail/mail";

export default class SendMail {
    smtpMail: SMTPMail

    constructor(smtp: SMTPMail) {
        this.smtpMail = smtp
    }

    async sendMail(data: Mail): Promise<boolean> {
        try {
            const result = await this.smtpMail.sendMail({
                text: data.getText(),
                subject: data.getSubject(),
                to: data.getTo().getFull(),
                files: data.getFiles(),
                html: data.getHtml()
            });
            return result
        } catch (error: any) {
            console.error('Ошибка: ' + error)
            return false
        }
    }

}
