import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { TGenderEnum } from '../user.enum';

@InputType()
export class UpdteUserInput {
  @MaxLength(16, {
    message: (args: ValidationArguments) => {
      if (args.value.length >= 16) {
        throw new BaseHttpException(ErrorCodeEnum.ERROR_USER_USERNAME_MAX);
        return '';
      }
    },
  })
  @MinLength(4, {
    message: (args: ValidationArguments) => {
      if (args.value.length <= 4) {
        throw new BaseHttpException(ErrorCodeEnum.ERROR_USER_USERNAME_MIN);
        return '';
      }
    },
  })
  @Field({ nullable: true })
  userName?: string;

  @MaxLength(10, {
    message: (args: ValidationArguments) => {
      if (args.value.length >= 10) {
        throw new BaseHttpException(ErrorCodeEnum.ERROR_USER_USERNAME_MAX);
        return '';
      }
    },
  })
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      if (args.value.length === 0) {
        throw new BaseHttpException(
          ErrorCodeEnum.ERROR_EMPTY,
          `${args.property} can not be empty`,
        );
        return '';
      }
    },
  })
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      if (args.value.length === 0) {
        throw new BaseHttpException(
          ErrorCodeEnum.ERROR_EMPTY,
          `${args.property} can not be empty`,
        );
        return '';
      }
    },
  })
  @MinLength(6, {
    message: (args: ValidationArguments) => {
      if (args.value.length <= 6) {
        throw new BaseHttpException(ErrorCodeEnum.ERROR_USER_USERNAME_MIN);
        return '';
      }
    },
  })
  @IsString({
    message: (args: ValidationArguments) => {
      if (typeof args.value === 'string') {
        throw new BaseHttpException(ErrorCodeEnum.ERROR_STRING);
        return '';
      }
    },
  })
  @Field({ nullable: true })
  password?: string;

  @IsOptional()
  @Field((type) => Timestamp, { nullable: true })
  birthDate?: Timestamp | number;

  @IsMobilePhone(null, null, {
    message: (args: ValidationArguments) => {
      throw new BaseHttpException(ErrorCodeEnum.INVALID_PHONE_NUMBER);
      return '';
    },
  })
  @Field({ nullable: true })
  phoneNumber?: string;

  @IsNotEmpty()
  @Field(() => TGenderEnum)
  gender?: TGenderEnum;

  @Field({ nullable: true })
  profilePicture?: string;
}
