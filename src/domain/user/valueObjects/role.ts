export enum Roles {
    user = 'user',
    moderator = 'moderator',
    admin = 'admin',
}

export interface IRole {
    title: string
}

export class Role {
    public readonly props: IRole

    private constructor(props: IRole) {
        this.props = Object.freeze(props)
    }

    getValue(): string {
        return this.props.title
    }

    public static getAvailables() {
        return Roles
    }
    public static create(role: string): Role|Error {
        if (!this.isValid(role)) {
            return new Error('Роль некорректна')
        }
        return new Role({ title: role })
    }

    private static isValid(role: string): boolean {
        return role in Roles
    }

}