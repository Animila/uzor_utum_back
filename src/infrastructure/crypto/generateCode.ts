import crypto from "crypto";

export function generateCode(): number {
    // Генерируем 3 байта (24 бита), что эквивалентно 6-ти шестнадцатеричным символам.
    const randomBytes = crypto.randomBytes(3)
    // Преобразуем шестнадцатеричное значение в число и ограничиваем его до 6 знаков.
    const code = parseInt(randomBytes.toString('hex'), 16) % 1000000
    // Переводим число в строку и добавляем нули спереди, если необходимо
    const data = code.toString().padStart(6, '0')
    return parseInt(data)
}