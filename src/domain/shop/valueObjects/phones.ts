import {Phone} from "./phone";

export class Phones {
    public readonly phones: Phone[];

    constructor(phones: Phone[]) {
        this.phones = phones;
    }

    getPhone(index: number): Phone {
        return this.phones[index];
    }

    getPhones(): string[] {
        return this.phones.map(item => item.getFullPhone());
    }

    getFullPhone(index: number): string {
        return this.phones[index].getFullPhone();
    }

    addPhone(phone: Phone): void {
        this.phones.push(phone);
    }


    setPhone(index: number, phone: Phone): void {
        this.phones[index] = phone;
    }

    removePhone(index: number): void {
        this.phones.splice(index, 1);
    }

    static create(phones: string[]): Phones | Error {
        const phoneInstances: Phone[] = [];
        for (const phone of phones) {
            const phoneInstance = Phone.create(phone);
            if (phoneInstance instanceof Error) {
                return phoneInstance;
            }
            phoneInstances.push(phoneInstance);
        }
        return new Phones(phoneInstances);
    }
}