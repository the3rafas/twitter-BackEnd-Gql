import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { PinoLogger } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { TwittesModule } from './twittes/twittes.module';
import { UserModule } from './user/user.module';
import { ContextModule } from './_common/context/context.module';
import { DatabaseModule } from './_common/database/database.module';
import { DataloaderModule } from './_common/dataloader/dataloader.module';
import { HttpExceptionFilter } from './_common/exceptions/exception-filter';
import { GqlResponseInterceptor } from './_common/graphql/graphql-response.interceptor';
import { GqlConfigService } from './_common/graphql/graphql.provider';
import { PubSub } from './_common/graphql/graphql.pubsub';
import { JSON } from './_common/graphql/json.scalar';
import { Timestamp } from './_common/graphql/timestamp.scalar';
import { LoggerModule } from './_common/logger/logger.module';
import { TransCodeModule } from './_common/queue/transeCode.module';
import { UploaderModule } from './_common/uploader/uploader.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    LoggerModule,
    DatabaseModule,
    UploaderModule,
    UserModule,
    EmailVerificationModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
      imports: [ContextModule, DataloaderModule],
    }),
    TwittesModule,
    AuthModule,
    TransCodeModule,
  ],
  controllers: [],
  providers: [
    PubSub,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    Timestamp,
    JSON,
    { provide: APP_PIPE, useClass: ValidationPipe },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (logger: PinoLogger) => new GqlResponseInterceptor(logger),
      inject: [PinoLogger],
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useFactory: (logger: PinoLogger) => new GqlResponseInterceptor(logger),
    //   inject: [PinoLogger],
    // },
  ],
})
export class AppModule {}
