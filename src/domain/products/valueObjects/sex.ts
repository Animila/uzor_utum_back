import {throws} from "node:assert";

export enum SexAll {
    male = 'male',
    female = 'female',
    all = 'all'
}

export interface ISex {
    title: string
}

export class Sex {
    public readonly props: ISex

    private constructor(props: ISex) {
        this.props = Object.freeze(props)
    }

    getValue(): string {
        return this.props.title
    }

    public static getAvailables() {
        return SexAll
    }
    public static create(role: string): Sex|Error {
        if (!this.isValid(role)) {
            return new Error('Пол некорректен')
        }
        return new Sex({ title: role })
    }

    private static isValid(role: string): boolean {
        return role in SexAll
    }

}