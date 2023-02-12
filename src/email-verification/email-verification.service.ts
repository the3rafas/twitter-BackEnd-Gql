import { Inject, Injectable, Ip } from '@nestjs/common';
import { ValidCodeInput, validUserInput } from './email-Validator.interface';
import { NodeMailerService } from '../_common/mail/mail.service';
import { EmailValidationTransformer } from './tramsformer/mail-validator.transformer';
import { ConfigService } from '@nestjs/config/dist';
import { Code } from './entity/email-validate.entity';
import { SendeMailValidatorInput } from './dto/sent-email.input';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/repository.interface';
import { User } from 'src/user/entity/user.entity';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { ResetPasswordINput } from './dto/email-validate-code.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    @Inject(Repositories.CodesRepository)
    private readonly codeRepo: IRepository<Code>,
    private readonly emailTransofrmer: EmailValidationTransformer,
    private readonly mailer: NodeMailerService,
  ) {}

  public generateVerificationCodeAndExpiryDate(): any {
    return {
      verificationCode:
        this.configService.get('NODE_ENV') === 'production'
          ? Math.floor(1000 + Math.random() * 9000).toString()
          : '1234',
      expiryDateAfterOneHour: new Date(Date.now() + 3600000),
    };
  }

  public async validVerificationCodeOrError(
    input: ValidCodeInput,
  ): Promise<Code> {
    const verificationCode: Code = await this.codeRepo.findOne({
      userId: input.user.id,
      code: input.code,
      useCase: input.useCase,
    });

    if (!verificationCode)
      throw new BaseHttpException(ErrorCodeEnum.VERIFICATION_CODE_NOT_EXIST);

    if (!verificationCode.code)
      throw new BaseHttpException(ErrorCodeEnum.VERIFICATION_CODE_NOT_EXIST);

    if (verificationCode.expiryDate < new Date())
      throw new BaseHttpException(ErrorCodeEnum.EXPIRED_VERIFICATION_CODE);
    return verificationCode;
  }
  // ##################### GENERATE AND SEND CODE  #####################

  async sendCodeToMail(input: SendeMailValidatorInput) {
    const user: User = await this.userRepo.findOne({ email: input.email });

    const generatedCode = this.generateVerificationCodeAndExpiryDate();
    const codeTransform = this.emailTransofrmer.emailValidatorInputTransformer(
      generatedCode,
      {
        userId: user.id,
        useCase: input.useCase,
      },
    );
    const mailTransformer = this.emailTransofrmer.emailBoxContentTransformer({
      to: input.email,
      subject: '',
      html: generatedCode.verificationCode,
    });

    await this.mailer.send(mailTransformer);
    this.codeRepo.createOne(codeTransform);
    return true;
  }

  // ##################### verify CODE  #####################

  async validateUser(input: validUserInput): Promise<Boolean> {
    const user: User = await this.userRepo.findOne({ email: input.email });
    if (!user.verifiedPhone) {
      const code: Code = await this.validVerificationCodeOrError({
        user: user,
        useCase: input.input.useCase,
        code: input.input.verificationCode,
      });
      let phone = user.notVerifiedPhone;

      await this.userRepo.updateOneFromExistingModel(user, {
        notVerifiedPhone: null,
      });
      await this.userRepo.updateOneFromExistingModel(user, {
        verifiedPhone: phone,
      });

      await code.destroy();
      return true;
    } else {
      throw new BaseHttpException(ErrorCodeEnum.USER_EMAIL_IS_VERIFIED);
    }
  }

  async resetPassword(input: ResetPasswordINput): Promise<Boolean> {
    const user: User = await this.userRepo.findOne({ email: input.email });
    console.log(input.code);

    const code: Code = await this.validVerificationCodeOrError({
      user: user,
      useCase: input.useCase,
      code: input.code,
    });
    input.password = await bcrypt.hash(input.password, 10);

    await this.userRepo.updateOneFromExistingModel(user, {
      password: input.password,
    });

    await code.destroy();
    return true;
  }
}
