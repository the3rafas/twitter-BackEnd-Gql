import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/repository.interface';
import { User } from './entity/user.entity';
import { CreateUserInput } from './dot/create-user.input';
import { twitterUserTransformer } from './transformer/user.transformer';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { Follower } from './entity/follower.entity';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { Twitte } from 'src/twittes/entity/twitter-twittes.entity';
import { Friend } from './entity/friend.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class twitterUserService {
  constructor(
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    @Inject(Repositories.FollowersRepository)
    private readonly followerRepo: IRepository<Follower>,
    @Inject(Repositories.FriendsRepository)
    private readonly friendRepo: IRepository<Friend>,
    private readonly userTrans: twitterUserTransformer,
  ) {}
  // ###################### User ########################
  async createUser(input: CreateUserInput): Promise<User> {
    const checkExisting = await this.userRepo.findOne({
      [Op.or]: [{ userName: input.userName }, { email: input.email }],
    });

    if (checkExisting) {
      throw new BaseHttpException(ErrorCodeEnum.EMAIL_UserName_ALREADY_EXISTS);
    }
    input.password = await bcrypt.hash(input.password, 10);
    const dataHandeller = this.userTrans.HandelCreartion(input);
    return await this.userRepo.findOrCreate(
      { userName: input.userName },
      dataHandeller,
    );
  }

  async findUser(userName: string): Promise<User> {
    try {
      return await this.userRepo.findOne({ userName });
    } catch (error) {
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    }
  }

  async updateUser(input: CreateUserInput, user: User): Promise<User> {
    try {
      const dataHandeller = this.userTrans.Handelupdate(input);

      return await this.userRepo.updateOneFromExistingModel(
        user,
        dataHandeller,
      );
    } catch (error) {
      throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
    }
  }
  async me(id: string) {
    return await this.userRepo.findOne({ id });
  }

  // ###################### FOllower ########################
  async followUser(followingId: string, followerId: string): Promise<Boolean> {
    const followeing = await this.userRepo.findOne({ id: followingId });

    if (followeing)
      var follow = await this.followerRepo.findOrCreate(
        {
          [Op.and]: {
            followerId,
            followingId,
          },
        },
        { followerId, followingId },
      );
    var followBack = await this.followerRepo.findOne({
      [Op.and]: {
        followerId: followingId,
        followingId: followerId,
      },
    });

    if (follow && followBack) {
      await this.friendRepo.findOrCreate(
        { followerId, followingId },
        { followerId, followingId },
      );
      return true;
    } else {
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    }
  }

  // async checkFollowUser(
  //   followingId: string,
  //   followerId: string,
  // ): Promise<Boolean> {
  //   try {
  //     const check = await this.followerRepo.findOne({
  //       [Op.and]: {
  //         followerId,
  //         followingId,
  //       },
  //     });
  //     return check ? true : false;
  //   } catch (error) {
  //     throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
  //   }
  // }
  async deleteFollowUser(
    followingId: string,
    followerId: string,
  ): Promise<Boolean> {
    const followeing = await this.userRepo.findOne({ id: followingId });
    if (!followeing)
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);

    try {
      const check = await this.followerRepo.findOne({
        [Op.and]: {
          followerId,
          followingId,
        },
      });
      await check.destroy();
      const friend = await this.friendRepo.findOne({
        followerId,
        followingId,
      });

      if (friend) await friend.destroy();
      return check ? true : false;
    } catch (error) {
      throw new BaseHttpException(ErrorCodeEnum.USER_IS_NOT_A_FOLLOWER);
    }
  }

  @Cron(CronExpression.EVERY_6_MONTHS)
  async deleteUnValidUser() {
    const users = await this.userRepo.findAll({
      verifiedPhone: { [Op.eq]: null },
    });
    users.forEach(async (e) => {
      let actualDate: number = new Date().getHours();
      let eDate: number = new Date(e.createdAt).getHours();

      if (eDate === actualDate || eDate === actualDate - 1) {
        return '';
      }

      await e.destroy();
    });
  }
  // ###################### Friend ########################
  // async addFriend(followingId: string, followerId: string): Promise<Boolean> {
  //   try {
  //      await this.friendRepo.findOrCreate(
  //       {
  //         [Op.or]: [
  //           { followerId, followingId },
  //           {
  //             followerId: followingId,
  //             followingId: followerId,
  //           },
  //         ],
  //       },
  //       { followerId, followingId },
  //     );

  //     return true;
  //   } catch (error) {
  //     throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
  //   }
  // }
  // async removeFriend(
  //   followingId: string,
  //   followerId: string,
  // ): Promise<Boolean> {
  //   try {
  //     const s = await this.friendRepo.findOrCreate(
  //       {
  //         [Op.or]: {
  //           [Op.and]: {
  //             followerId,
  //             followingId,
  //           },
  //           [Op.and]: {
  //             followerId: followingId,
  //             followingId: followerId,
  //           },
  //         },
  //       },
  //       { followerId, followingId },
  //     );
  //     console.log(s);

  //     await s.destroy();

  //     return true;
  //   } catch (error) {
  //     throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
  //   }
  // }
}
