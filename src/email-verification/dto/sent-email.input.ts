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
export class SendeMailValidatorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserVerificationCodeUseCaseEnum)
  @Field(() => UserVerificationCodeUseCaseEnum)
  useCase: UserVerificationCodeUseCaseEnum;
}
