import { Module } from '@nestjs/common';

import { NodeMailerService } from './mail.service';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class MailerModule {}
