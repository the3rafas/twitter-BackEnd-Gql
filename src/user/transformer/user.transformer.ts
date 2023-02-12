import { Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dot/create-user.input';

@Injectable()
export class twitterUserTransformer {
  constructor() {}
  HandelCreartion(input: CreateUserInput) {
    return {
      ...input,
      notVerifiedPhone: input.phoneNumber,
    };
  }
  Handelupdate(input: CreateUserInput) {
    return {
      ...input,
      VerifiedPhone: input.phoneNumber,
    };
  }
}
