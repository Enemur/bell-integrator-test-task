import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { BookEntity } from '../entity/book.entity';

@EntityRepository(BookEntity)
@Service()
export class BookRepository extends Repository<BookEntity> {
  public async getBookById(bookId: number): Promise<BookEntity | undefined> {
    return await this.findOne({ where: { id: bookId } });
  }
}
