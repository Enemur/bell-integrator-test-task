import { ApolloClient }  from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

export function createClient(): ApolloClient<NormalizedCacheObject> {
  const port = +(process.env.PORT ?? '4000');
  // @ts-ignore
  const link = createHttpLink({ uri: `http://localhost:${port}/`, fetch });

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}
