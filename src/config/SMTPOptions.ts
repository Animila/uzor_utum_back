import SMTPMail from "../infrastructure/smtp/SMTPMail";
import RabbitMQ from "../infrastructure/rabbitmq/RabbitMQ";
import SendMail from "../useCases/mail/sendMail";

export const smtpService = new SMTPMail({
    service: 'gmail',
    password: process.env.SMTP_PASSWORD || '',
    user: process.env.SMTP_USERNAME || '',
});

export const rabbit = new RabbitMQ(
    `amqp://${process.env.LOGIN_RABBIT}:${process.env.PASS_RABBIT}@localhost:5672`,
    new SendMail(smtpService)
)