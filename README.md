# BackBurner - Server

This is the backend server for [BackBurner client](https://backburner.now.sh "BackBurner").
> Live on heroku @ https://thebackburner.herokuapp.com

## Core Technologies

- Node.js
- PostgresSQL
- express.js
- JWT
- XSS

## Services

- `/users: GET, POST, PATCH`
- `/tasks: GET, POST, DELETE`
- `/rewards: GET, POST, DELETE`

## Local/Development Set-up

> **Requirements**: [Node.js](https://nodejs.org), [npm](https://www.npmjs.com/get-npm), [postgresql](https://www.postgresql.org/)

1. Clone this repo
2. Set up database table as `backburner`:

```bash
$ createdb [connection-option...][option...] backburner
```

3. Set up `.env`
    * **Must Include:**
    * NODE_ENV
    * PORT
    * MIGRATION_DB_HOST
    * MIGRATION_DB_PORT
    * MIGRATION_DB_NAME
    * MIGRATION_DB_USER
    * MIGRATION_DB_PASS
    * DB_URL
    * JWT_SECRET
  
4. Install `node_modules` and `migrate`:

```bash
.../backburner-server $ npm install
.../backburner-server $ npm run migrate
```

5. Seed database with sample data _(Optional)_

```bash
.../backburner-server $ psql -d backburner -f ./seeds/seed.backburner_tables.sql
```