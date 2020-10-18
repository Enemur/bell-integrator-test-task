import { Args, Mutation, Resolver } from 'type-graphql';
import { CreateAuthorInputDTO } from '../dto/input/create-author.input.dto';
import { Inject } from 'typedi';
import { AppService } from '../service/app.service';
import { AuthorEntity } from '../entity/author.entity';

@Resolver(AuthorEntity)
export class AuthorResolver {
  @Inject()
  private readonly appService!: AppService;

  @Mutation(() => AuthorEntity)
  async createAuthor(@Args() dto: CreateAuthorInputDTO): Promise<AuthorEntity> {
    return await this.appService.createAuthor(dto);
  }
}
