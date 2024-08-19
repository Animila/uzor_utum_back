import amqp, * as rab from 'amqplib'
import {Email} from "../../domain/user/valueObjects/email";
import {Mail} from "../../domain/mail/mail";
import SendMail from "../../useCases/mail/mailSend";

class RabbitMQ {
    private connectionUrl: string
    private mailService: SendMail
    private connection: rab.Connection | null = null
    private channel: amqp.Channel | null = null

    constructor(connectionUrl: string, mailService: SendMail) {
        this.connectionUrl = connectionUrl;
        this.mailService = mailService;

        process.on('exit', async () => {
            await this.closeConnection();
        });
    }

    private async createConnection(): Promise<void> {
        if (!this.connection) {
            this.connection = await amqp.connect(this.connectionUrl);
        }
    }

    private async createChannel(): Promise<void> {
        if (!this.channel) {
            await this.createConnection();
            this.channel = await this.connection!.createChannel();
        }
    }

    public async assertQueue(queueName: string): Promise<void> {
        await this.createChannel();
        await this.channel!.assertQueue(queueName, {
            durable: true
        });
    }

    public async connectQueue(): Promise<void> {
        await this.assertQueue('sendEmail');
        await this.channel!.consume('sendEmail', async data => {
            try {
                const bufferData = Buffer.from(data?.content!);
                const dataMail: { subject: string, to: string, text: string } = JSON.parse(bufferData.toString());
                console.log('Received data: ', dataMail);
                const checkEmail = Email.create(dataMail.to);
                if (checkEmail instanceof Error) {
                    console.log('Invalid email format');
                    this.channel?.reject(data!, false);
                    return;
                }
                const mailOptions = {
                    to: checkEmail as Email,
                    subject: dataMail.subject,
                    text: dataMail.text
                };
                const newMail = new Mail(mailOptions);
                const result: boolean = await this.mailService.sendMail(newMail);
                if (result) {
                    this.channel?.ack(data!);
                } else {
                    throw new Error('Failed to send email');
                }

            } catch (err: any) {
                console.error('RabbitMQ error: ', err);
                setTimeout(() => this.channel?.reject(data!, true), 5000); // возвращает сообщение в очередь
            }
        }, {noAck: false});
    }

    public async sendEmail(data: {
        to: string
        subject: string
        text: string
    }): Promise<void> {
        try {
            await this.assertQueue('sendEmail');
            this.channel!.sendToQueue(
                'sendEmail',
                Buffer.from(JSON.stringify(data)),
                {
                    persistent: true
                }
            );
        } catch (err: any) {
            throw new Error('RabbitMQ error: ' + err);
        }
    }

    public async closeConnection(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
            this.channel = null;
        }
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
        }
    }
}

export default RabbitMQ
