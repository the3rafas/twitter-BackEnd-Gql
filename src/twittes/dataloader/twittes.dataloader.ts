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
  TwitteDataLoaderType,
  CommentTwitteLoader,
} from '../../_common/dataloader/dataloader.type';
import { Twitte } from 'src/twittes/entity/twitter-twittes.entity';
import { Op } from 'sequelize';
import { Like } from 'src/twittes/entity/likes.entity';
import { Comment } from 'src/twittes/entity/comments.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class TwitteDataloader implements IDataLoaderService {
  constructor(
    @Inject(Repositories.TwittesRepository)
    private readonly twitteRepo: IRepository<Twitte>,
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    @Inject(Repositories.LikesRepository)
    private readonly likeRepo: IRepository<Like>,
    @Inject(Repositories.CommentsRepository)
    private readonly commentRepo: IRepository<Comment>,
    private readonly helper: HelperService,
  ) {}

  public createLoaders(): TwitteDataLoaderType {
    const userLoader: UserLoaderType = new DataLoader(
      async (senderIds: string[]) => await this.findUsersByIds(senderIds),
    );

    const likesTwitteLoader: likeLoaderType = new DataLoader(
      async (senderIds: string[]) => await this.findLikesByIds(senderIds),
    );
    const commentTwitteLoader: CommentTwitteLoader = new DataLoader(
      async (senderIds: string[]) => await this.findCommentsByIds(senderIds),
    );

    return {
      userLoader,
      likesTwitteLoader,
      commentTwitteLoader,
    };
  }

  private async findCommentsByIds(usersIds: string[]) {

    const comments = await this.commentRepo.findAll({
      twitteId: { [Op.in]: usersIds },
    });

    const arrayMap = await this.helper.sortDataLoader(
      Comment,
      comments,
      'twitteId',
    );

    return [...usersIds.map((id) => arrayMap[id])];
  }

  private async findLikesByIds(usersIds: string[]) {

    const likes = await this.likeRepo.findAll({
      twitteId: { [Op.in]: usersIds },
    });

    const arrayMap = await this.helper.sortDataLoader(
      Twitte,
      likes,
      'twitteId',
    );

    return [...usersIds.map((id) => arrayMap[id])];
  }

  private async findUsersByIds(usersIds: string[]) {
    const Users = await this.userRepo.findAll({
      id: { [Op.in]: usersIds },
    });

    const arrayMap = await this.helper.sortDataLoader(User, Users, 'id');

    return [...usersIds.map((id) => arrayMap[id])];
  }
}
