import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  Length,
  IsString,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
@InputType()
export class CreateTwitteInput {
  @IsOptional()
  @Length(0, 700, {
    message: (args: ValidationArguments) => {
      if (args.value.length >= 700) {
        throw new BaseHttpException(ErrorCodeEnum.ERROR_TWITTE_MAX);
        return '';
      } else if (args.value.length <= 0) {
        throw new BaseHttpException(ErrorCodeEnum.ERROR_TWITTE_MIN);
        return '';
      }
    },
  })
  @Field({ nullable: true })
  content?: string;

  @IsOptional()
  @Field({ nullable: true })
  photo?: string;
}
