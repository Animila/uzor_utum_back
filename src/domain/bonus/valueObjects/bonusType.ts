export enum BonusTypeAll {
    minus = 'minus',
    plus = 'plus'
}

export interface IBonus {
    title: string
}

export class BonusType {
    public readonly props: IBonus

    private constructor(props: IBonus) {
        this.props = Object.freeze(props)
    }

    getValue(): string {
        return this.props.title
    }

    public static getAvailables() {
        return BonusTypeAll
    }
    public static create(role: string): BonusType|Error {
        if (!this.isValid(role)) {
            return new Error('Пол некорректен')
        }
        return new BonusType({ title: role })
    }

    private static isValid(role: string): boolean {
        return role in BonusTypeAll
    }

}