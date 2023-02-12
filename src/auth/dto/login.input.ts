import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
// import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
// import { TGenderEnum } from '../user.enum';

@InputType()
export class LogInInput {
  @IsNotEmpty()
  @Field()
  userName: string;

  @IsNotEmpty()
  @Field()
  password: string;
}
