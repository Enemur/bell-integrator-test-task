import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import { createClient } from './util/create-client.util';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { CreateBookInputDTO } from '../src/dto/input/create-book.input.dto';
import { CreateAuthorInputDTO } from '../src/dto/input/create-author.input.dto';
import { createServer } from './util/create-server.util';
import { initTestEnv } from './util/init-test-env.util';
import { createTypeormConnection } from './util/create-typeorm-connection.util';
import { AuthorRepository } from '../src/respository/author.repository';
import { getConnection } from 'typeorm';
import { BookRepository } from '../src/respository/book.repository';
import { BookEntity } from '../src/entity/book.entity';

describe('App Service', () => {
  let client: ApolloClient<NormalizedCacheObject>;
  let server: ApolloServer;

  let authorRepository: AuthorRepository;
  let bookRepository: BookRepository;

  beforeAll(async () => {
    await initTestEnv();
    await createTypeormConnection();
    server = await createServer();
    client = createClient();

    authorRepository = getConnection().getCustomRepository(AuthorRepository);
    bookRepository = getConnection().getCustomRepository(BookRepository);

    const port = +(process.env.PORT ?? '4000');
    await server.listen(port);
  });

  it('Create author', async () => {
    const createAuthorSchema = gql`
      mutation CreateAuthor($name: String!) {
        createAuthor(name: $name) {
          id
          name
        }
      }
    `;

    const dto: CreateAuthorInputDTO = {
      name: 'author-1',
    };

    const result = await client.mutate({
      mutation: createAuthorSchema,
      variables: dto,
    });

    const exists = !!(await authorRepository.getAuthorById(result.data.createAuthor.id));
    expect(exists).toBe(true);
  });

  it('Create book', async () => {
    const createBookSchema = gql`
      mutation CreateBook($name: String!, $pageCount: Int!, $authorId: Int!) {
        createBook(name: $name, pageCount: $pageCount, authorId: $authorId) {
          id
          author {
            name
          }
        }
      }
    `;

    const author = await authorRepository.save({ name: 'author-2' });

    const dto: CreateBookInputDTO = {
      name: 'book-1',
      authorId: author.id,
      pageCount: 10,
    };

    const result = await client.mutate({
      mutation: createBookSchema,
      variables: dto,
    });

    const exists = !!(await bookRepository.getBookById(result.data.createBook.id));
    expect(exists).toBe(true);
  });

  it('Get books without authors', async () => {
    const getBooksSchema = gql`
      {
        books {
          id
          name
          authorId
        }
      }
    `;

    await bookRepository.clear();

    const author = await authorRepository.save({ name: 'author-3' });

    const booksInitData = [
      { author: { id:  author.id }, name: 'book-1', pageCount: 1 },
      { author: { id:  author.id }, name: 'book-2', pageCount: 2 },
      { author: { id:  author.id }, name: 'book-3', pageCount: 3 }
    ];

    await bookRepository.save(booksInitData);

    const result = await client.query({
      query: getBooksSchema,
    });

    expect(result.data.books).toHaveLength(booksInitData.length);
    result.data.books.forEach((book: BookEntity) => expect(book).not.toHaveProperty('author'));
  });

  it('Get books with authors', async () => {
    const getBooksSchema = gql`
      {
        books {
          id
          name
          authorId
          author {
            name
          }
        }
      }
    `;

    await bookRepository.clear();

    const author = await authorRepository.save({ name: 'author-3' });

    const booksInitData = [
      { author: { id:  author.id }, name: 'book-1', pageCount: 1 },
      { author: { id:  author.id }, name: 'book-2', pageCount: 2 },
      { author: { id:  author.id }, name: 'book-3', pageCount: 3 }
    ];

    await bookRepository.save(booksInitData);


    const result = await client.query({
      query: getBooksSchema,
    });

    expect(result.data.books).toHaveLength(booksInitData.length);

    result.data.books.forEach((book: BookEntity) => expect(book).toHaveProperty('author'));
  });
});
