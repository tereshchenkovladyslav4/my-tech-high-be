/* eslint-disable @typescript-eslint/no-var-requires*/
const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;
module.exports = {
  name: 'default',
  type: 'mysql',
  synchronize: false,
  autoLoadEntities: true,
  logging: true,
  cache: true,
  timezone: 'UTC',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'infocenter',
  entities: ['dist/models/**/*.entity.*'],

  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['dist/migration/**/*.*'],
  cli: {
    migrationsDir: 'src/migration',
  },
};
