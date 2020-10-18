import { ApolloServer } from 'apollo-server';
import { IGraphqlContext } from '../../src/core/abstract/graphql-context.interface';
import { buildSchema } from 'type-graphql';
import { Resolvers } from '../../src/resolver';
import { Container } from 'typedi';

export async function createServer() {
  const schema = await buildSchema({
    resolvers: Resolvers,
    container: Container,
  });

  return new ApolloServer({
    schema,
    context: {
      authorLoaders: new WeakMap(),
    } as IGraphqlContext,
  });
}
