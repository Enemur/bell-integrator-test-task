import { AuthorEntity } from '../../entity/author.entity';
import DataLoader from 'dataloader';

export interface IGraphqlContext {
  authorLoaders: WeakMap<object, DataLoader<number, AuthorEntity>>;
}
