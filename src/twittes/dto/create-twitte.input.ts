import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsString, IsOptional } from 'class-validator';
@InputType()
export class CreateTwitteInput {
  @IsOptional()
  @Length(0, 700)
  @Field({ nullable: true })
  content?: string;

  @IsOptional()
  @Field({ nullable: true })
  photo?: string;
}
