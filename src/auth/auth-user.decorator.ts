import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';

export const CurrentUser = createParamDecorator(
  (file, ctx: GqlExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const { currentUser } = gqlCtx.getContext();

    if (!currentUser)
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);

    if (file) return currentUser[file];
    return currentUser;
  },
);
