import { Args, FieldResolver, Mutation, Query, Resolver, Root, Ctx, Info } from 'type-graphql';
import { Inject } from 'typedi';
import { AppService } from '../service/app.service';
import { CreateBookInputDTO } from '../dto/input/create-book.input.dto';
import { BookEntity } from '../entity/book.entity';
import { AuthorEntity } from '../entity/author.entity';
import { IGraphqlContext } from '../core/abstract/graphql-context.interface';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AuthorRepository } from '../respository/author.repository';

@Resolver(BookEntity)
export class BookResolver {
  @Inject()
  private readonly appService!: AppService;

  @InjectRepository()
  private readonly authorRepository!: AuthorRepository;

  @Mutation(() => BookEntity)
  async createBook(@Args() dto: CreateBookInputDTO): Promise<BookEntity> {
    return await this.appService.createBook(dto);
  }

  @Query(() => [ BookEntity ])
  async books(): Promise<BookEntity[]> {
    return await this.appService.getBooks();
  }

  @FieldResolver()
  async author(@Root() book: BookEntity, @Ctx() context: IGraphqlContext, @Info() info: any): Promise<AuthorEntity> {
    return await this.appService.loadAuthorField(book, context, info);
  }
}
