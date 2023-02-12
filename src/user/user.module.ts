import { Module } from '@nestjs/common';
import { twitterUserService } from './user.service';
import { twitterUserResolver } from './user.resolver';
import { twitterUserTransformer } from './transformer/user.transformer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserDataloader } from './dataloader/user.dataloader';
import { HelperModule } from 'src/_common/utils/helper.module';

@Module({
  imports: [HelperModule],
  providers: [
    twitterUserService,
    twitterUserResolver,
    twitterUserTransformer,
    UserDataloader,
  ],
  exports: [UserDataloader],
})
export class UserModule {}
