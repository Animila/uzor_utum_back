import crypto from "crypto";

export function generateCode(n: number = 5): string {
    // Генерируем 3 байта (24 бита), что эквивалентно 6-ти шестнадцатеричным символам.
    const randomBytes = crypto.randomBytes(3)
    // Преобразуем шестнадцатеричное значение в число и ограничиваем его до 6 знаков. (для изменения размера удалить 0)
    const code = parseInt(randomBytes.toString('hex'), 16) % 10 ** n
    // Переводим число в строку и добавляем нули спереди, если необходимо
    const data = code.toString().padStart(n, '0')
    return data
}