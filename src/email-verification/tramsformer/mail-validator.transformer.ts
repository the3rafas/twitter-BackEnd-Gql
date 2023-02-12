import { Injectable } from '@nestjs/common';
import {
  emailValidatorInput,
  ResetPasswordINput,
} from '../dto/email-validate-code.input';

import {
  GeneratedCode,
  MailBoxInput,
  TramsformGenCode,
} from '../email-Validator.interface';

@Injectable()
export class EmailValidationTransformer {
  emailValidatorInputTransformer(
    input: GeneratedCode,
    transformer: TramsformGenCode,
  ) {
    return {
      useCase: transformer.useCase,
      code: input.verificationCode,
      expiryDate: input.expiryDateAfterOneHour,
      userId: transformer.userId,
    };
  }

  emailBoxContentTransformer(input: MailBoxInput) {
    return {
      to: input.to,
      subject: 'verification Code',
      html: `<h1 style="color:#5b21b6;">${input.html}</h1>`,
    };
  }

  validateInputTransformer(input: emailValidatorInput) {
    return {
      input: {
        verificationCode: input.code,
        useCase: input.useCase,
      },
      email: input.email,
    };
  }
  // resetPasswordInputTransformer(input: ResetPasswordINput) {
  //   return {
  //     input: {
  //       verificationCode: input.code,
  //       useCase: input.useCase,
  //     },
  //     email: input.email,
  //     password: input.password,
  //   };
  // }
}
