export interface IEmail {
    email: string
}

export class Email {
    public readonly props: IEmail

    constructor(props: IEmail) {
        this.props = Object.freeze(props)
    }

    getFull(): string {
        return this.props.email
    }

    getDomain(): string {
        return this.props.email.split('@')[1]
    }

    public static create(email: string): Email | Error {
        if (!this.isValid(email)) {
            return new Error('Почта некорректна (--@--.ru)')
        }
        return new Email({ email: this.format(email) })
    }

    private static format(email: string) {
        return email.trim().toLowerCase()
    }

    private static isValid(email: string): boolean {
        // ..@...ru
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        )
    }

}