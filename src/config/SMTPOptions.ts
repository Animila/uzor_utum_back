import SMTPMail from "../infrastructure/smtp/SMTPMail";
import SendMail from "../useCases/mail/sendMail";
import {RabbitMQ} from "../infrastructure/rabbitmq/RabbitMQ";

export const smtpService = new SMTPMail({
    service: process.env.SMTP_SERVICE || 'gmail',
    password: process.env.SMTP_PASSWORD || '',
    user: process.env.SMTP_USERNAME || '',
});

export const rabbit = new RabbitMQ(
    process.env.RABBIT_MQ || '',
    new SendMail(smtpService)
)