// import { UserVerificationCodeUseCaseEnum } from "src/user/user.enum";
// import { ValidVerificationCodeOrErrorInput } from "src/user/user.interface";
import { registerEnumType } from '@nestjs/graphql';
import { User } from 'src/user/entity/user.entity';

export interface GeneratedCode {
  verificationCode: string;
  expiryDateAfterOneHour: Date;
}

export interface TramsformGenCode {
  useCase: UserVerificationCodeUseCaseEnum;
  userId: string;
}

export interface ValidCodeInput {
  user: User;
  useCase: UserVerificationCodeUseCaseEnum;
  code: string;
}

export interface MailBoxInput {
  to: string;
  html: string;
  subject: string;
}
export interface ValidVerificationCodeOrErrorInput {
  verificationCode: string;
  useCase: UserVerificationCodeUseCaseEnum;
}
// export interface PasswordReset {
//   password: string;
//   verificationCode: string;
//   useCase: UserVerificationCodeUseCaseEnum;
// }
// export interface ResetPasswordnput {
//   input: PasswordReset;
//   email: string;
// }

export interface validUserInput {
  input: ValidVerificationCodeOrErrorInput;
  email: string;
}

export enum UserVerificationCodeUseCaseEnum {
  PASSWORD_RESET = 'PASSWORD_RESET',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}
registerEnumType(UserVerificationCodeUseCaseEnum, {
  name: 'UserVerificationCodeUseCaseEnum',
});
