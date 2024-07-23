
export enum LikeTypeAll {
    like = 'like',
    unlike = 'unlike'
}

export interface ILikeType {
    title: string
}

export class LikeType {
    public readonly props: ILikeType

    private constructor(props: ILikeType) {
        this.props = Object.freeze(props)
    }

    getValue(): string {
        return this.props.title
    }

    public static getAvailables() {
        return LikeTypeAll
    }
    public static create(role: string): LikeType|Error {
        if (!this.isValid(role)) {
            return new Error('Тип лайка некорректен')
        }
        return new LikeType({ title: role })
    }

    private static isValid(role: string): boolean {
        return role in LikeTypeAll
    }

}