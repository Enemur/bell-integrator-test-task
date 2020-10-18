import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function getTestOrmConfig(): ConnectionOptions {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +(process.env.DATABASE_PORT ?? '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
    migrationsTableName: process.env.DATABASE_MIGRATIONS_TABLE_NAME,
    migrations:  [ 'src/**/*Migration.ts' ],
    logging: process.env.DATABASE_LOGGING === 'true',
    entities:  [ 'src/**/**.entity.ts' ],
    namingStrategy: new SnakeNamingStrategy(),
    dropSchema: true,
  };
}
