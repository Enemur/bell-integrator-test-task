import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { TableName } from '../core/const/table-name.enum';
import { AuthorEntity } from './author.entity';
import { Field, Int, ObjectType } from 'type-graphql';

@Entity(TableName.Books)
@ObjectType()
export class BookEntity {
  @PrimaryGeneratedColumn('increment')
  @Field()
  id!: number;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field(() => Int)
  pageCount!: number;

  @ManyToOne(() => AuthorEntity, author => author.books)
  @Field(() => AuthorEntity)
  author!: AuthorEntity;

  @RelationId((book: BookEntity) => book.author)
  @Field(() => Int)
  authorId!: number;
}
