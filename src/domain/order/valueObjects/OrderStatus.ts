
export enum OrderStatusAll {
    PENDING='PENDING',
    SUCCESSED='SUCCESSED',
    CANCALLED='CANCALLED'
}

export interface IOrderStatus {
    title: string
}

export class OrderStatus {
    public readonly props: IOrderStatus

    private constructor(props: IOrderStatus) {
        this.props = Object.freeze(props)
    }

    getValue(): string {
        return this.props.title
    }

    public static getAvailables() {
        return OrderStatusAll
    }
    public static create(role: string): OrderStatus|Error {
        if (!this.isValid(role)) {
            return new Error('Статус заказа некорректен')
        }
        return new OrderStatus({ title: role })
    }

    private static isValid(role: string): boolean {
        return role in OrderStatusAll
    }

}