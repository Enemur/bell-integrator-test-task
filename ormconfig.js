require('dotenv').config();
const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: (process.env.IS_USE_SSL === 'true') ? {
    rejectUnauthorized: false,
    ca: process.env.DATABASE_SSL_CA,
    key: process.env.DATABASE_SSL_KEY,
    cert: process.env.DATABASE_SSL_CERT,
  } : undefined,

  entities: [ `${ process.env.TS_NODE === 'true' ? '**/*.entity.ts' : '**/*.entity.js' }` ],

  namingStrategy: new SnakeNamingStrategy(),

  migrationsTableName: process.env.DATABASE_MIGRATIONS_TABLE_NAME,
  migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
  migrations: [ `${ process.env.TS_NODE === 'true' ? '**/*Migration.ts' : '**/*Migration.js' }` ],

  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',

  cli: {
    migrationsDir: 'src/migration'
  }
};
