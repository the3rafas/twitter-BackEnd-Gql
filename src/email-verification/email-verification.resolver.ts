import { InjectQueue } from '@nestjs/bull';
import { UseFilters, UseGuards } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Queue } from 'bull';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';
// import { BaseHttpException } from 'src/_common/exception/base-http-exception';
import { TRANS_CODE } from 'src/_common/queue/constant';
import { TransCodeService } from 'src/_common/queue/transeCode.service';
// import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';
import {
  emailValidatorInput,
  ResetPasswordINput,
} from './dto/email-validate-code.input';
import { SendeMailValidatorInput } from './dto/sent-email.input';
import { EmailVerificationService } from './email-verification.service';
import { Code } from './entity/email-validate.entity';
import { EmailValidationTransformer } from './tramsformer/mail-validator.transformer';

@Resolver(() => Code)
export class EmailVerificationResolver {
  constructor(
    private readonly emailVerifyService: EmailVerificationService,
    private readonly emailTransofrmer: EmailValidationTransformer,
    private readonly queueService: TransCodeService,
  ) {}

  // ########################  Mutation  #########################
  @Mutation(() => GqlBooleanResponse, { name: 'SentCodeMail' })
  async sendCodeToMail(@Args('input') input: SendeMailValidatorInput) {
    await this.queueService.addQueue(
      'email',
      this.emailVerifyService.sendCodeToMail(input),
      { delay: 5000 },
    );
    return true;
  }

  @Mutation((returns) => GqlBooleanResponse, { name: 'verifyAcount' })
  async verifyCode(@Args('input') input: emailValidatorInput) {
    const inputTransformer =
      this.emailTransofrmer.validateInputTransformer(input);

    return this.emailVerifyService.validateUser(inputTransformer);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => GqlBooleanResponse, { name: 'resetPaaword' })
  async resetPaaword(@Args('input') input: ResetPasswordINput) {
    return  this.emailVerifyService.resetPassword(input);
  }
}
