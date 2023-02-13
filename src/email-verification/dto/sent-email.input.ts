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
export class SendeMailValidatorInput {
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
