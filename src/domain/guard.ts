/**
 * Интерфейс IGuardResult представляет результат проверки стражей (guards).
 */
export interface IGuardResult {
    succeeded: boolean
    message?: string
}

/**
 * Интерфейс IGuardArgument представляет аргумент для использования в стражах.
 */
export interface IGuardArgument {
    argument: any
    argumentName: string
}

/**
 * Тип GuardArgumentCollection представляет коллекцию аргументов для использования в стражах.
 */
export type GuardArgumentCollection = IGuardArgument[]

/**
 * Класс Guard предоставляет статические методы для проверок (стражей).
 */
export class Guard {
    /**
     * Метод combine комбинирует результаты нескольких проверок и возвращает общий результат.
     * Если хотя бы одна проверка не прошла, возвращается результат первой неудачной проверки.
     * @param {IGuardResult[]} guardResults - Массив результатов проверок.
     * @returns {IGuardResult} - Общий результат проверок.
     */
    public static combine(guardResults: IGuardResult[]): IGuardResult {
        for (const result of guardResults) {
            if (!result.succeeded) {
                return result
            }
        }

        return { succeeded: true }
    }

    /**
     * Метод againstNullOrUndefined проверяет, что аргумент не является null или undefined.
     * @param {any} argument - Проверяемый аргумент.
     * @param {string} argumentName - Имя проверяемого аргумента.
     * @returns {IGuardResult} - Результат проверки.
     */
    public static againstNullOrUndefined(
        argument: any,
        argumentName: string
    ): IGuardResult {
        if (argument === null || argument === undefined) {
            return {
                succeeded: false,
                message: `Заполните поле ${argumentName} `,
            }
        }

        return { succeeded: true }
    }

    /**
     * Метод againstNullOrUndefinedBulk проверяет несколько аргументов на null или undefined.
     * @param {GuardArgumentCollection} args - Коллекция аргументов для проверки.
     * @returns {IGuardResult} - Результат проверки.
     */
    public static againstNullOrUndefinedBulk(
        args: GuardArgumentCollection
    ): IGuardResult {
        for (const arg of args) {
            const result = this.againstNullOrUndefined(arg.argument, arg.argumentName)

            if (!result.succeeded) return result
        }

        return { succeeded: true }
    }

    /**
     * Метод isOneOf проверяет, что значение является одним из допустимых значений.
     * @param {any} value - Проверяемое значение.
     * @param {any[]} validValues - Массив допустимых значений.
     * @param {string} argumentName - Имя проверяемого аргумента.
     * @returns {IGuardResult} - Результат проверки.
     */
    public static isOneOf(
        value: any,
        validValues: any[],
        argumentName: string
    ): IGuardResult {
        let isValid = false

        for (const validValue of validValues) {
            if (value === validValue) {
                isValid = true
            }
        }

        if (isValid) {
            return { succeeded: true }
        }

        return {
            succeeded: false,
            message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
                validValues
            )}. Got "${value}".`,
        }
    }

    /**
     * Метод inRange проверяет, что число находится в пределах заданного диапазона.
     * @param {number} num - Проверяемое число.
     * @param {number} min - Минимальное значение диапазона.
     * @param {number} max - Максимальное значение диапазона.
     * @param {string} argumentName - Имя проверяемого аргумента.
     * @returns {IGuardResult} - Результат проверки.
     */
    public static inRange(
        num: number,
        min: number,
        max: number,
        argumentName: string
    ): IGuardResult {
        const isInRange = num >= min && num <= max

        if (!isInRange) {
            return {
                succeeded: false,
                message: `${argumentName} is not within range ${min} to ${max}.`,
            }
        }

        return { succeeded: true }
    }

    /**
     * Метод allInRange проверяет, что все числа в массиве находятся в пределах заданного диапазона.
     * @param {number[]} numbers - Массив проверяемых чисел.
     * @param {number} min - Минимальное значение диапазона.
     * @param {number} max - Максимальное значение диапазона.
     * @param {string} argumentName - Имя проверяемого аргумента.
     * @returns {IGuardResult} - Результат проверки.
     */
    public static allInRange(
        numbers: number[],
        min: number,
        max: number,
        argumentName: string
    ): IGuardResult {
        let failingResult = {}

        for (const num of numbers) {
            const numIsInRangeResult = this.inRange(num, min, max, argumentName)

            if (!numIsInRangeResult.succeeded) {
                failingResult = numIsInRangeResult
            }
        }

        if (failingResult) {
            return {
                succeeded: false,
                message: `${argumentName} is not within the range.`,
            }
        }

        return { succeeded: true }
    }
}