# API проекта Uzor Utum
Данный репозиторий предоставляет код для работы с базой данных и клиентскими приложениями

# Стек технологий
- Fastify JS
- Prisma
- Typescript
- Docker
- Swagger
- Domain-Drive-Design
- Clear Architecture

# Архитектура

Проект разработан в рамках паттерна Domain Driven Design (DDD) в рамках чистой архитектуры. Самое главные понятия:
- Домен (domains) - бизнес-логика. Независимая от кода, платформы и фреймворк
- Сушности (Entities) - описание объектов домене 


# Настройка окружение и запуск
Для работы требуется Docker или Rancher для работы с docker-compose. 
Сначала установим проект:

```shell
git clone git@github.com:Animila/uzor_utum_back.git
cd uzor_utum_back
```

Затем создадим файл env из env.example и заполните необходимые данные
```shell
cp .env.example .env
```

После чего запустим проект через команду:
```shell
nerdctl compose -f docker-compose.yml up -d --build
```

Готово