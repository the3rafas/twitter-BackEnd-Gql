import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { UserVerificationCodeUseCaseEnum } from '../email-Validator.interface';

@InputType()
export class emailValidatorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  code: string;

  @IsNotEmpty()
  @IsEnum(UserVerificationCodeUseCaseEnum)
  @Field(() => UserVerificationCodeUseCaseEnum)
  useCase: UserVerificationCodeUseCaseEnum;
}

@InputType()
export class ResetPasswordINput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  code: string;

  @IsNotEmpty()
  @Field()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserVerificationCodeUseCaseEnum)
  @Field(() => UserVerificationCodeUseCaseEnum)
  useCase: UserVerificationCodeUseCaseEnum;
}
