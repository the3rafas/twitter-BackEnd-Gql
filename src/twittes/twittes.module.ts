import { Module } from '@nestjs/common';
import { HelperModule } from 'src/_common/utils/helper.module';
import { TwitteDataloader } from './dataloader/twittes.dataloader';
import { TwittesResolver } from './twittes.resolver';
import { TwittesService } from './twittes.service';

@Module({
  imports: [HelperModule],
  providers: [TwittesService, TwittesResolver, TwitteDataloader],
  exports: [TwitteDataloader],
})
export class TwittesModule {}
