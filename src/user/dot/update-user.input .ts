import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { TGenderEnum } from '../user.enum';

@InputType()
export class UpdteUserInput {
  @MaxLength(16)
  @MinLength(4)
  @Field({ nullable: true })
  userName?: string;

  @MaxLength(10)
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;

  @IsNotEmpty()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  password?: string;

  @IsOptional()
  @Field((type) => Timestamp, { nullable: true })
  birthDate?: Timestamp | number;

  @Field({ nullable: true })
  phoneNumber?: string;

  @IsNotEmpty()
  @Field(() => TGenderEnum)
  gender?: TGenderEnum;

  @Field({ nullable: true })
  profilePicture?: string;
}
