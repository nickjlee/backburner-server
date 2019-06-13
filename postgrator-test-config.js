require('dotenv').config()

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  host: process.env.TEST_MIGRATION_DB_HOST,
  port: process.env.TEST_MIGRATION_DB_PORT,
  database: process.env.TEST_MIGRATION_DB_NAME,
  username: process.env.TEST_MIGRATION_DB_USER,
  password: process.env.TEST_MIGRATION_DB_PASS
}
