import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/repository.interface';
import { User } from 'src/user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
// import { UsersService } from 'src/users/users.service';
// import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any, context: ExecutionContext): Promise<User> {
    const { sub: id } = payload;
    const user: User = await this.userRepo.findOne({ id });
    if (!user) {
      throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
    }

    return user;
  }
}
