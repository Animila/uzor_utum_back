export interface IAttributes {
    [key: string]: any;
}

export class Attributes {
    public readonly props: IAttributes;

    constructor(props: IAttributes) {
        this.props = props
    }

    getAttribute(key: string): any {
        return this.props[key];
    }

    getAttributes(): IAttributes {
        return this.props;
    }

    setAttribute(key: string, value: any): void {
        this.props[key] = value;
    }

    removeAttribute(key: string): void {
        delete this.props[key];
    }

    static create(attributes: IAttributes): Attributes {
        // Можно добавить дополнительные проверки атрибутов здесь
        return new Attributes(attributes);
    }

}