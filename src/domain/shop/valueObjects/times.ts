export interface ITimes {
    [key: string]: any;
}

export class Times {
    public readonly props: ITimes;

    constructor(props: ITimes) {
        this.props = props
    }

    getTime(key: string): any {
        return this.props[key];
    }

    getTimes(): ITimes {
        return this.props;
    }

    setTime(key: string, value: any): void {
        this.props[key] = value;
    }

    removeTime(key: string): void {
        delete this.props[key];
    }

    static create(attributes: ITimes): Times {
        // Можно добавить дополнительные проверки атрибутов здесь
        return new Times(attributes);
    }

}