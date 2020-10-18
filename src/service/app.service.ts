import { Service } from 'typedi';
import { BookRepository } from '../respository/book.repository';
import { AuthorRepository } from '../respository/author.repository';
import { BookEntity } from '../entity/book.entity';
import { CreateBookInputDTO } from '../dto/input/create-book.input.dto';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CreateAuthorInputDTO } from '../dto/input/create-author.input.dto';
import { AuthorEntity } from '../entity/author.entity';

@Service()
export class AppService {
  // region Injects

  @InjectRepository()
  private readonly bookRepository!: BookRepository;

  @InjectRepository()
  private readonly authorRepository!: AuthorRepository;

  // endregion

  // region Public Methods

  public async getBooks(): Promise<BookEntity[]> {
    return await this.bookRepository.find();
  }

  public async createBook(dto: CreateBookInputDTO): Promise<BookEntity> {
    const author = await this.authorRepository.getAuthorById(dto.authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    return await this.bookRepository.save({
      name: dto.name,
      pageCount: dto.pageCount,
      author: { id: author.id },
    });
  }

  public async createAuthor(dto: CreateAuthorInputDTO): Promise<AuthorEntity> {
    return await this.authorRepository.save({
      name: dto.name,
    });
  }

  public async getAuthorById(authorId: number): Promise<AuthorEntity | undefined> {
    return await this.authorRepository.getAuthorById(authorId);
  }

  // endregion
}
