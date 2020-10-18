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
import faker from 'faker';
import { getRandomInt } from './util/get-random-int.util';
import { AuthorEntity } from '../src/entity/author.entity';

faker.seed(Date.now());

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

  it('should create author', async () => {
    const createAuthorSchema = gql`
      mutation CreateAuthor($name: String!) {
        createAuthor(name: $name) {
          id
          name
        }
      }
    `;

    const dto: CreateAuthorInputDTO = {
      name: faker.name.findName(),
    };

    const result = await client.mutate({
      mutation: createAuthorSchema,
      variables: dto,
    });

    const createdAuthor = await authorRepository.getAuthorById(result.data.createAuthor.id);

    const exists = createdAuthor !== undefined;
    expect(exists).toBe(true);

    if (createdAuthor) {
      expect(createdAuthor.name).toBe(dto.name);
    }
  });

  it('should create book', async () => {
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

    const author = await authorRepository.save({ name: faker.name.findName() });

    const dto: CreateBookInputDTO = {
      name: faker.lorem.sentence(),
      authorId: author.id,
      pageCount: getRandomInt(1, 1000),
    };

    const result = await client.mutate({
      mutation: createBookSchema,
      variables: dto,
    });

    const createdBook = await bookRepository.getBookById(result.data.createBook.id);

    const exists = createdBook !== undefined;
    expect(exists).toBe(true);

    if (createdBook) {
      expect(createdBook.name).toBe(dto.name);
      expect(createdBook.pageCount).toBe(dto.pageCount);
      expect(createdBook.authorId).toBe(dto.authorId);
    }
  });

  it('should get books without authors', async () => {
    const getBooksSchema = gql`
      {
        books {
          id
          name
          pageCount
          authorId
        }
      }
    `;

    await bookRepository.clear();

    const { books } = await initBooksData();

    const result = await client.query({
      query: getBooksSchema,
    });

    expect(result.data.books).toHaveLength(books.length);

    result.data.books.forEach((book: BookEntity) => {
      expect(book).not.toHaveProperty('author');

      const savedBook = books.find(x => x.id === book.id);

      expect(savedBook).toBeDefined();

      if (!savedBook) {
        return;
      }

      expect(book.name).toBe(savedBook.name);
      expect(book.authorId).toBe(savedBook.authorId);
      expect(book.pageCount).toBe(savedBook.pageCount);
    });
  });

  it('should get books with authors', async () => {
    const getBooksSchema = gql`
      {
        books {
          id
          name
          authorId
          pageCount
          author {
            id
            name
          }
        }
      }
    `;

    await bookRepository.clear();

    const { authors, books } = await initBooksData();

    const result = await client.query({
      query: getBooksSchema,
    });

    expect(result.data.books).toHaveLength(books.length);

    result.data.books.forEach((book: BookEntity) => {
      expect(book).toHaveProperty('author');

      const savedBook = books.find(x => x.id === book.id);
      const author = authors.find(x => x.id === book.authorId);

      expect(savedBook).toBeDefined();
      expect(author).toBeDefined();

      if (!savedBook || !author) {
        return;
      }

      expect(book.name).toBe(savedBook.name);
      expect(book.authorId).toBe(savedBook.authorId);
      expect(book.pageCount).toBe(savedBook.pageCount);
      expect(book.author.id).toBe(author.id);
      expect(book.author.name).toBe(author.name);
    });
  });

  async function initBooksData(): Promise<{ books: BookEntity[], authors: AuthorEntity[] }> {
    const countAuthors = getRandomInt(1, 5);
    const promises = [];

    for (let i = 0; i < countAuthors; i++) {
      promises.push(
        authorRepository.save({ name: faker.name.findName() })
      );
    }

    const authors = await Promise.all(promises);

    const countInitialData = getRandomInt(5, 15);
    const booksInitData = [];

    for (let i = 0; i < countInitialData; i++) {
      const author = authors[getRandomInt(authors.length, 0)]

      booksInitData.push({ author: { id:  author.id }, name: faker.lorem.sentence(), pageCount: getRandomInt(1, 1000) });
    }

    const books = await bookRepository.save(booksInitData);

    return {
      authors,
      books,
    };
  }
});
