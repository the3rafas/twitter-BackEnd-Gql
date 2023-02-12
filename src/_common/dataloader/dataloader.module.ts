import { Module } from '@nestjs/common';
import { TwittesModule } from 'src/twittes/twittes.module';
import { UserModule } from '../../user/user.module';
import { HelperModule } from '../utils/helper.module';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: [UserModule, TwittesModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
