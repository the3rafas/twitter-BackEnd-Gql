import { Module } from '@nestjs/common';
import { EmailVerificationResolver } from './email-verification.resolver';
import { EmailVerificationService } from './email-verification.service';
import { EmailValidationTransformer } from './tramsformer/mail-validator.transformer';
import { NodeMailerService } from '../_common/mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { TransCodeModule } from 'src/_common/queue/transeCode.module';
import { MailerModule } from 'src/_common/mail/mail.module';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot(), TransCodeModule, MailerModule],
  providers: [
    EmailVerificationResolver,
    EmailVerificationService,
    EmailValidationTransformer,
    NodeMailerService,
  ],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
