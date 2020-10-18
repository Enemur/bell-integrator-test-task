import * as dotenv from 'dotenv';

export function initTestEnv() {
  dotenv.config({
    path: 'test/.env'
  });
}
