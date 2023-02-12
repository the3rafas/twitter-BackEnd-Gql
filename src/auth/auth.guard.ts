import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { GqlContext } from 'src/_common/graphql/graphql-context.type';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import {
  IContextAuthService,
  IContextAuthServiceToken,
} from '../_common/context/context-auth.interface';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    const { userName, password } = ctx.getArgs().loginInput;
    const user = await this.authService.vaildateUser(userName, password);
    request.currentUser = user;

    const { currentUser } = ctx.getContext();

    if (!currentUser) throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);

    this.logger.log('>>>>>>>>>>>>>>>>>>>>>Autherized>>>>>>>>>>>>>>>>>>>');
    return true;
  }
}
