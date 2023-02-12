import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/repository.interface';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { HelperService } from 'src/_common/utils/helper.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { CreateTwitteInput } from './dto/create-twitte.input';
import { FilterPgInput, PaginationInput } from './dto/pagination.input';
import { Comment } from './entity/comments.entity';
import { Like } from './entity/likes.entity';
import { Twitte } from './entity/twitter-twittes.entity';

@Injectable()
export class TwittesService {
  constructor(
    @Inject(Repositories.TwittesRepository)
    private readonly twitteRepo: IRepository<Twitte>,
    @Inject(Repositories.LikesRepository)
    private readonly likeRepo: IRepository<Like>,
    @Inject(Repositories.CommentsRepository)
    private readonly commentRepo: IRepository<Comment>,
    private readonly helper: HelperService,
  ) {}
  // ########################## Twitte  #######################################
  async create(input: CreateTwitteInput, userId: string) {
    if (!input.photo && !input.content) {
      throw new BaseHttpException(ErrorCodeEnum.U_CANT_ENTER_EMPTY_TWITTE);
    }

    return await this.twitteRepo.createOne({ ...input, userId });
  }

  async findAll(filter: FilterPgInput, input: PaginationInput) {
    return this.twitteRepo.findPaginated(
      {
        ...(filter.photo && {
          photo: { [Op.ne]: '' },
        }),
        ...(filter.content && {
          content: { [Op.ne]: '' },
        }),
        ...(filter.both && {
          content: { [Op.ne]: '' },
          photo: { [Op.ne]: '' },
        }),
        ...(filter.searchKey && {
          [Op.or]: [
            {
              content: {
                [Op.iLike]: `%${this.helper.trimAllSpaces(filter.searchKey)}%`,
              },
              photo: {
                [Op.iLike]: `%${this.helper.trimAllSpaces(filter.searchKey)}%`,
              },
            },
          ],
        }),
      },
      input.sort,
      input.page,
      input.limit,
    );
  }

  async findTweetsPaginate() {
    return this.twitteRepo.findPaginated({}, '-createdAt', 1, 5);
  }

  async findAllForUser(userName: string) {
    try {
      return await this.twitteRepo.findAll({
        photo: { [Op.ne]: '' },
      });
    } catch (error) {
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    }
  }


  async delete(id: string, userId: string): Promise<Boolean> {
    const twitte = await this.twitteRepo.findOne({
      id,
    });
    if (!twitte)
      throw new BaseHttpException(ErrorCodeEnum.TWITTE_DOES_NOT_EXIST);

    if (twitte.userId === userId) {
      const likes = await this.likeRepo.findAll({
        twitteId: twitte.id,
      });
      const comment = await this.commentRepo.findAll({
        twitteId: twitte.id,
      });
      likes.forEach(async (e) => await e.destroy());
      comment.forEach(async (e) => await e.destroy());

      await twitte.destroy();

      return true;
    }
    throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
  }

  // ########################## Like  #######################################

  async like(twitteId: string, userId: string): Promise<Boolean> {
    const twitte = await this.twitteRepo.findOne({
      id: twitteId,
    });
    if (!twitte)
      throw new BaseHttpException(ErrorCodeEnum.TWITTE_DOES_NOT_EXIST);

    await this.likeRepo.findOrCreate(
      {
        [Op.and]: {
          twitteId,
          userId,
        },
      },
      { twitteId, userId },
    );

    return true;
  }

  async unLike(twitteId: string, userId: string): Promise<Boolean> {
    const like = await this.likeRepo.findOne({
      [Op.and]: {
        twitteId,
        userId,
      },
    });

    if (!like) throw new BaseHttpException(ErrorCodeEnum.TWITTE_DOES_NOT_EXIST);

    await like.destroy();

    return true;
  }

  // ########################## Comment  #######################################

  async addComment(input: CreateCommentInput, userId: string) {
    if (!input.photo && !input.content) {
      throw new BaseHttpException(ErrorCodeEnum.U_CANT_ENTER_EMPTY_COMMENT);
    }
    const twitte = await this.twitteRepo.findOne({
      id: input.twitteId,
    });

    if (!twitte)
      throw new BaseHttpException(ErrorCodeEnum.TWITTE_DOES_NOT_EXIST);
    try {
      return await this.commentRepo.createOne({ ...input, userId });
    } catch (error) {
      console.log(error);
    }
  }

  async FindAllComment(twitteId: string) {
    return await this.commentRepo.findAll({
      twitteId,
    });
  }
  async deleteComment(commentId: string, userId: string): Promise<Boolean> {
    console.log('enter');

    const comment = await this.commentRepo.findOne({
      id: commentId,
    });
    if (!comment)
      throw new BaseHttpException(ErrorCodeEnum.COMMENT_DOES_NOT_EXIST);

    if (comment.userId === userId) {
      await comment.destroy();
      return true;
    }

    return true;
  }
}
