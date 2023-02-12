import * as DataLoader from 'dataloader';
import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from 'src/_common/database/repository.interface';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IDataLoaderService } from '../../_common/dataloader/dataloader.interface';
// import { SecurityGroup } from '../security-group/entity/security-group.model';
import { HelperService } from '../../_common/utils/helper.service';
import {
  UserLoaderType,
  UserDataLoaderType,
  TwitteLoaderType,
  FollowereLoaderType,
  likeLoaderType,
  CommentLoaderType,
} from '../../_common/dataloader/dataloader.type';
import { User } from '../entity/user.entity';
import { Twitte } from 'src/twittes/entity/twitter-twittes.entity';
import { Op } from 'sequelize';
import { Follower } from '../entity/follower.entity';
import { Like } from 'src/twittes/entity/likes.entity';
import { Comment } from 'src/twittes/entity/comments.entity';

@Injectable()
export class UserDataloader implements IDataLoaderService {
  constructor(
    @Inject(Repositories.TwittesRepository)
    private readonly twitteRepo: IRepository<Twitte>,
    @Inject(Repositories.FollowersRepository)
    private readonly followerRepo: IRepository<Follower>,
    @Inject(Repositories.LikesRepository)
    private readonly likeRepo: IRepository<Like>,
    @Inject(Repositories.CommentsRepository)
    private readonly commentRepo: IRepository<Comment>,
    private readonly helper: HelperService,
  ) {}

  public createLoaders(): UserDataLoaderType {
    const twitteLoader: TwitteLoaderType = new DataLoader(
      async (senderIds: string[]) => await this.findTwittesByIds(senderIds),
    );
    const followerLoader: FollowereLoaderType = new DataLoader(
      async (senderIds: string[]) => await this.findFollowersByIds(senderIds),
    );
    const likeLoader: likeLoaderType = new DataLoader(
      async (senderIds: string[]) => await this.findLikesByIds(senderIds),
    );
    const commentLoader: CommentLoaderType = new DataLoader(
      async (senderIds: string[]) => await this.findCommentsByIds(senderIds),
    );
    return {
      twitteLoader,
      followerLoader,
      likeLoader,
      commentLoader,
    };
  }

  private async findCommentsByIds(usersIds: string[]) {
    const comments = await this.commentRepo.findAll(
      {
        userId: { [Op.in]: usersIds },
      },
      [Twitte],
    );
    const arrayMap = await this.helper.sortDataLoader(
      Comment,
      comments,
      'userId',
    );

    return [...usersIds.map((id) => arrayMap[id])];
  }
  private async findLikesByIds(usersIds: string[]) {
    const likes = await this.likeRepo.findAll(
      {
        userId: { [Op.in]: usersIds },
      },
      [Twitte],
    );
    const arrayMap = await this.helper.sortDataLoader(Like, likes, 'userId');

    return [...usersIds.map((id) => arrayMap[id])];
  }
  private async findFollowersByIds(usersIds: string[]) {
    const followers = await this.followerRepo.findAll(
      {
        followerId: { [Op.in]: usersIds },
      },
      [User],
    );
    const arrayMap = await this.helper.sortDataLoader(
      Follower,
      followers,
      'followerId',
    );

    return [...usersIds.map((id) => arrayMap[id])];
  }

  private async findTwittesByIds(usersIds: string[]) {
    let userMap: { [key: string]: Twitte[] } = {};

    const twittes = await this.twitteRepo.findAll({
      userId: { [Op.in]: usersIds },
    });

    const arrayMap = await this.helper.sortDataLoader(
      Twitte,
      twittes,
      'userId',
    );

    return [...usersIds.map((id) => arrayMap[id])];
  }
}
