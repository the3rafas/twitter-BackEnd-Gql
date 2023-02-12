import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  Length,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';
@InputType()
export class CreateCommentInput {
  @IsOptional()
  @Length(0, 700)
  @Field({ nullable: true })
  content?: string;

  @IsOptional()
  @Field({ nullable: true })
  photo?: string;

  @IsUUID()
  @IsNotEmpty()
  @Field()
  twitteId: string;
}
