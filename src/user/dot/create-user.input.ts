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
export class CreateUserInput {
  @MaxLength(16)
  @MinLength(4)
  @Field()
  userName: string;

  @MaxLength(10)
  @Field()
  name: string;

  @Field({ nullable: true })
  bio?: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsOptional()
  @Field((type) => Timestamp, { nullable: true })
  birthDate?: Timestamp | number;

  @Field()
  phoneNumber: string;

  @IsNotEmpty()
  @Field(() => TGenderEnum)
  gender: TGenderEnum;

  @Field({ nullable: true })
  profilePicture?: string;
}
