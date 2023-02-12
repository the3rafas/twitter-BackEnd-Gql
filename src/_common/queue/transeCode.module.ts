import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TransCodeService } from './transeCode.service';
import { TRANS_CODE } from './constant';
import { TransCodeConsumer } from './transCode.consumer';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASS'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: TRANS_CODE,
    }),
  ],
  providers: [TransCodeService, TransCodeConsumer],
  exports: [TransCodeService],
})
export class TransCodeModule {}
