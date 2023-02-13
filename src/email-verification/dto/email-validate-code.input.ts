import { HttpException, HttpStatus } from '@nestjs/common';
import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
  IsEnum,
  ValidationArguments,
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
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      if (args.value.length === 0) {
        throw new HttpException(
          `${args.property} can not be empty`,
          HttpStatus.BAD_REQUEST,
        );
        return '';
      }
    },
  })
  @IsEmail()
  email: string;

  @Field()
  code: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      if (args.value.length === 0) {
        throw new HttpException(
          `${args.property} can not be empty`,
          HttpStatus.BAD_REQUEST,
        );
        return '';
      }
    },
  })
  @Field()
  password: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      if (args.value.length === 0) {
        throw new HttpException(
          `${args.property} can not be empty`,
          HttpStatus.BAD_REQUEST,
        );
        return '';
      }
    },
  })
  @IsEnum(UserVerificationCodeUseCaseEnum)
  @Field(() => UserVerificationCodeUseCaseEnum)
  useCase: UserVerificationCodeUseCaseEnum;
}
