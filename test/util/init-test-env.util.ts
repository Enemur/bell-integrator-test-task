import * as dotenv from 'dotenv';

export function initTestEnv() {
  dotenv.config({
    path: '.env.test'
  });

  process.env.TS_NODE = 'true';
  process.env.DATABASE_DROP_SCHEMA = 'true';
}
