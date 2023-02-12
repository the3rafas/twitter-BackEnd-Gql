import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { IContextAuthServiceToken } from './context-auth.interface';
import { ContextAuthService } from './context-auth.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '36000s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    { useClass: ContextAuthService, provide: IContextAuthServiceToken },
  ],
  exports: [
    { useClass: ContextAuthService, provide: IContextAuthServiceToken },
  ],
})
export class ContextModule {}
