export interface iItems {
    [key: string]: any;
}

export class Items {
    public readonly props: iItems;

    constructor(props: iItems) {
        this.props = props
    }

    getAttribute(key: string): any {
        return this.props[key];
    }

    getAttributes(): iItems {
        return this.props;
    }

    setAttribute(key: string, value: any): void {
        this.props[key] = value;
    }

    removeAttribute(key: string): void {
        delete this.props[key];
    }

    static create(attributes: iItems): Items {
        // Можно добавить дополнительные проверки атрибутов здесь
        return new Items(attributes);
    }

}