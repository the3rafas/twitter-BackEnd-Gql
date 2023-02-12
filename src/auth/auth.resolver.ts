import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { User } from 'src/user/entity/user.entity';
import { GqlUserResponse } from 'src/user/user.response';
import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';
import { AuthGuard } from './auth.guard';
import { GqlCodeResponse, loginResponde } from './auth.responde';
import { AuthService } from './auth.service';
import { LogInInput } from './dto/login.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authServ: AuthService) {}

  @Query(() => GqlCodeResponse, { name: 'logIn' })
  @UseGuards(AuthGuard)
  async login(
    @Args('loginInput') loginInput: LogInInput,
    @Context() context: any,
  ) {
    return await this.authServ.login(context.currentUser);
  }
}
