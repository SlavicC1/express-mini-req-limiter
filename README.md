# Ограничитель запросов к API
[ТЗ](https://docviewer.yandex.ru/view/132386136/?*=oEBcNoOgkm%2FmcDfN%2FlA9FKXA5bR7InVybCI6InlhLW1haWw6Ly8xNzk4NjI1MTAxMTgxMTY4NTEvMS4yIiwidGl0bGUiOiJ3ZWIgZGV2ZWxvcGVyIHRlc3QgdGFzay0xLnR4dCIsIm5vaWZyYW1lIjpmYWxzZSwidWlkIjoiMTMyMzg2MTM2IiwidHMiOjE2NTY4NTY3Nzk3NDksInl1IjoiODgyNTEyMzg0MTY1NjYyNjQyMiJ9)

## Настроики

### Настройка среды
    npm install

### Токен для доступа к приватному пути
**server/insex.js**

    const router = require('./routes')('token-1');

### Подключение СУБД
**server/routes/insex.js**

    const RequestLimiter = require('../models/limiter')(
    {
        pgConectingString: "строка подключения Postgres",
        tableName: "имя таблицы в БД"
    },
    //конфигурационный объект ioredis:
    {
        port: 6379,
        host: "127.0.0.1",
        db: 0, 
    });
### Ссылки
["строка подключения Postgres"](http://vitaly-t.github.io/pg-promise/Database.html)

[конфигурационный объект ioredis](https://github.com/luin/ioredis)

## Примечания
    Запуск/перезапуск сервера чистит указанные таблицы в БД