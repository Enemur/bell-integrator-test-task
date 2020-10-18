import { ArgsType, Field } from 'type-graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@ArgsType()
export class CreateAuthorInputDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(36)
  @Field()
  name!: string;
}
