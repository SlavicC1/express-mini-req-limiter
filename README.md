## Description

  App enviroment variables sets in .env file
  
  Docker postgres container parameters sets in src/scripts/start-db.sh

  Docker redis container parameters sets in src/scripts/start-cache.sh

## Installation

```bash
$ npm install
```

## Running containers in docer

```bash
# postgres
$ npm run start:dev:db

# redis
$ npm run start:dev:cache
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
