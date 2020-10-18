import { EntityRepository, Repository } from 'typeorm';
import { AuthorEntity } from '../entity/author.entity';
import { Service } from 'typedi';

@EntityRepository(AuthorEntity)
@Service()
export class AuthorRepository extends Repository<AuthorEntity> {
  public async getAuthorById(authorId: number): Promise<AuthorEntity | undefined> {
    return await this.findOne({ where: { id: authorId } });
  }
}
