import {throws} from "node:assert";

interface IPhone {
    phone: string
}

export class Phone {
    public readonly props: IPhone

    constructor(props: IPhone) {
        this.props = Object.freeze(props)
    }

    getFullPhone(): string {
        return this.props.phone
    }

    getOnlyNumber(): number | null {
        const number = this.props.phone.replace(/\D/g, '')
        return number ? parseInt(number) : null
    }

    getNumberCode(): number | null {
        /** получить телефонный код */
        const number = this.props.phone.replace(/\D/g, '')
        return number ? parseInt(number) : null
    }

    getRegionCode(): number | null {
        const code = this.props.phone.match(/\((\d{1,3})\)/)
        return code ? parseInt(code[1]) : null
    }

    getCountryCode(): number | null {
        const code = this.props.phone.match(/^\+(\d{1,4})/)
        return code ? parseInt(code[1]) : null
    }

    public static create(phone: string): Phone|Error {
        if (!this.isValid(phone)) {
            return new Error('Телефон не соответствует маске: +9(999)999-99-99')
        }
        return new Phone({ phone: phone })
    }

    public static isValid(phone: string): boolean {
        // return phone.length <= 14; // Возвращаем false, если размер строки больше 13
        // // +9(999)999-99-99
        return /^\+\d\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)
    }
}