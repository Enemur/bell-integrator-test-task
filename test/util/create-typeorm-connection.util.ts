import { Container } from 'typedi';
import { createConnection, useContainer } from 'typeorm';

export async function createTypeormConnection() {
  useContainer(Container);

  await createConnection();
}
