import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TableName } from '../core/const/table-name.enum';
import { BookEntity } from './book.entity';
import { Field, Int, ObjectType } from 'type-graphql';

@Entity(TableName.Authors)
@ObjectType()
export class AuthorEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  name!: string;

  @OneToMany(() => BookEntity, book => book.author)
  books!: BookEntity[];
}
