import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { ConfigService } from './core/service/config.service';
import { createConnection, useContainer } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { IGraphqlContext } from './core/abstract/graphql-context.interface';
import { Resolvers } from './resolver';

async function bootstrap(): Promise<void> {
  const schema = await buildSchema({
    resolvers: Resolvers,
    container: Container,
  });

  useContainer(Container);

  const configService = Container.get(ConfigService);

  const ssl = (configService.database.ssl.isUse) ? {
    ca: configService.database.ssl.ca,
    cert: configService.database.ssl.cert,
    key: configService.database.ssl.key,
    rejectUnauthorized: false,
  } : undefined;

  await createConnection({
    type: "postgres",
    host: configService.database.host,
    port: configService.database.port,
    username: configService.database.username,
    password: configService.database.password,
    database: configService.database.database,
    synchronize: configService.database.synchronize,
    logging: configService.database.logging,
    migrationsTableName: configService.database.migrations.tableName,
    migrationsRun: configService.database.migrations.run,
    ssl,
    entities: [ (configService.tsNode) ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js' ],
    migrations: [ (configService.tsNode) ? 'src/**/*Migration.ts' : 'dist/**/*Migration.js' ],
    namingStrategy: new SnakeNamingStrategy(),
  });

  const server = new ApolloServer({
    schema,
    playground: configService.isGraphQLPlaygroundEnabled,
    debug: configService.isGraphQLDebugEnabled,
    context: {
      authorLoaders: new WeakMap(),
    } as IGraphqlContext,
  });

  const { url } = await server.listen(configService.port);

  if (configService.isGraphQLPlaygroundEnabled) {
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } else {
    console.log('Server is running');
  }
}

bootstrap();
