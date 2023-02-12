import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/entity/user.entity';

export const GetUser = createParamDecorator(
  async (data, context: ExecutionContext): Promise<User> => {
    const ctx = GqlExecutionContext.create(context);
    const { currentUser } = await ctx.getContext();

    if (data) {
      return currentUser[data];
    }

    return currentUser;
  },
);
