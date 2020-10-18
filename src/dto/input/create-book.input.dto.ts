import { ArgsType, Field, Int } from 'type-graphql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@ArgsType()
export class CreateBookInputDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(() => Int)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  pageCount!: number;

  @Field(() => Int)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  authorId!: number;
}
