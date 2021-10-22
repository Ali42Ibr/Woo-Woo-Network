module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './db.sqlite3',
  },
  test: {
    database: 'database_test',
    dialect: 'sqlite',
    storage: './test-db.sqlite3',
  },
  production: {
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    host: 'postgres-database',
    dialect: 'postgres',
  },
};
