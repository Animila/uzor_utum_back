import SMTPMail from "../infrastructure/smtp/SMTPMail";
import RabbitMQ from "../infrastructure/rabbitmq/RabbitMQ";
import SendMail from "../useCases/mail/sendMail";

export const smtpService = new SMTPMail({
    service: process.env.SMTP_SERVICE || 'gmail',
    password: process.env.SMTP_PASSWORD || '',
    user: process.env.SMTP_USERNAME || '',
});

export const rabbit = new RabbitMQ(
    process.env.RABBIT_MQ || '',
    new SendMail(smtpService)
)