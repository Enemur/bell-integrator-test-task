import { AuthorResolver } from './author.resolver';
import { BookResolver } from './book.resolver';
import { NonEmptyArray } from 'type-graphql';

export const Resolvers: NonEmptyArray<Function> = [
  AuthorResolver,
  BookResolver,
];
