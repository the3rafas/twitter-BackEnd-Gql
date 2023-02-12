import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  Length,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { GenderEnum } from 'src/user/user.enum';

@InputType()
export class WhereInput {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  TwitteId: string;
}

@InputType()
export class PaginationInput {
  @IsOptional()
  @Length(0, 700)
  @Field({ nullable: true })
  sort?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  limit?: number;
}

@InputType()
export class FilterPgInput {
  @IsOptional()
  @Field({ nullable: true })
  searchKey?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  photo?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  content?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  both?: boolean;

  @IsOptional()
  @IsEnum(GenderEnum)
  @Field(() => GenderEnum, { nullable: true })
  gender?: GenderEnum;
}
