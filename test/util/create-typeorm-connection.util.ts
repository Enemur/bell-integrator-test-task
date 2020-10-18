import { Container } from 'typedi';
import { createConnection, useContainer } from 'typeorm';
import { getTestOrmConfig } from '../test-orm-config';

export async function createTypeormConnection() {
  useContainer(Container);

  await createConnection(getTestOrmConfig());
}
