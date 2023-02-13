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
  ValidationArguments,
} from 'class-validator';
import { GenderEnum } from 'src/user/user.enum';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';

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
