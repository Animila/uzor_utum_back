export const mailCert = (code: string, type: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подарочный сертификат</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content p {
            font-size: 18px;
            color: #333333;
            line-height: 1.6;
        }
        .content .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 15px 30px;
            background-color: #FF6347;
            color: #ffffff;
            text-decoration: none;
            border-radius: 50px;
            font-size: 18px;
        }
        .content .cta-button:hover {
            background-color: #ff4500;
        }
        .footer {
            background-color: #f1f1f1;
            padding: 10px 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Ваш подарочный сертификат!</h1>
        </div>
        <div class="content">
            <p>Поздравляем, вам прислали подарок!</p>
            <p>Кто-то оформил вам сертификат на сумму ${type} рублей. Пин-код для предоставления:</p>
            <p style="font-size: 24px; font-weight: bold; margin: 20px 0;">${code}</p>
            <p>Нажмите на кнопку ниже, чтобы использовать свой подарочный сертификат и насладиться покупками!</p>
            <a href="https://uzorutum.ru" class="cta-button">Начать покупки!</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 Uzor Utum. Все права защищены.</p>
            <p>Если у вас есть вопросы <a href="mailto:uzor_utum@mail.ru">свяжитесь с нами</a>.</p>
        </div>
    </div>
</body>
</html>`
}
