import nodemailer from "nodemailer";

interface IMail {
    to: string;
    subject: any;
    text?: string;
    html?: string;
    files?: string
}

class SMTPMail {
    public transporter: nodemailer.Transporter
    public user: string
    public password: string
    public service: string

    constructor(settings: {user: string, password: string, service: string}) {
        this.service = settings.service
        this.user = settings.user
        this.password = settings.password
        this.transporter = this.createTransport()
    }
    createTransport() {
        return nodemailer.createTransport({
            service: this.service,
            auth: {
                user: this.user,
                pass: this.password,
            },
        })
    }

    async sendMail(data: IMail): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(
                {
                    text: data.text,
                    alternatives: data.files as any,
                    html: data.html,
                    from: this.user,
                    to: data.to,
                    subject: data.subject,

                },
                (error, info) => {
                    if (error) {
                        console.error('Ошибки отправки письма: ', error)
                        reject(new Error(`Ошибки отправки письма: ${error}`))
                    } else {
                        console.info('Письмо отправлено: ', info.response)
                        resolve(true)
                    }
                }
            )
        })
    }
}

export default SMTPMail