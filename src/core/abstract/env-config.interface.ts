export interface IEnvConfig {
  PORT: number;
  NODE_ENV: string;

  GQL_DEBUG: boolean;
  GQL_PLAYGROUND: boolean;

  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_LOGGING: boolean;
  DATABASE_KEEP_CONNECTION_ALIVE: boolean;
  DATABASE_MIGRATIONS_RUN: boolean;
  DATABASE_MIGRATIONS_TABLE_NAME: string;
  DATABASE_SSL_CA: string;
  DATABASE_SSL_CERT: string;
  DATABASE_SSL_KEY: string;
  IS_USE_SSL: boolean;

  TS_NODE: boolean;
}
