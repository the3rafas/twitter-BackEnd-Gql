import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/repository.interface';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { User } from 'src/user/entity/user.entity';
import { loginResponde, TokenResponde } from './auth.responde';
@Injectable()
export class AuthService {
  constructor(
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    private readonly jwtService: JwtService,
  ) {}
  // ###################### authGuard ########################

  async vaildateUser(userName: string, pass: string): Promise<User> {
    const user = await this.userRepo.findOne({ userName });
    const valid = await bcrypt.compare(pass, user.password);

    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    if (!valid) throw new BaseHttpException(ErrorCodeEnum.WRONG_PASSWORD);

    if (!user.verifiedPhone)
      throw new BaseHttpException(ErrorCodeEnum.USER_EMAIL_IS_NOT_VERIFIED_YET);

    return user;
  }
  // ###################### FOllower ########################

  async login(user: User) {
    return {
      access_Token: this.jwtService.sign({
        userName: user.userName,
        sub: user.id,
      }),
      user,
    };
  }
}
