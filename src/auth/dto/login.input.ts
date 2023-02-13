import { HttpException, HttpStatus } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
// import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
// import { TGenderEnum } from '../user.enum';

@InputType()
export class LogInInput {
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
  userName: string;

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
}
