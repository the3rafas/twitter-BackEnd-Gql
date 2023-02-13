import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { IDataLoaders } from 'src/_common/dataloader/dataloader.interface';
import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';
import { CreateCommentInput } from './dto/create-comment.input';
import { CreateTwitteInput } from './dto/create-twitte.input';
import { FilterPgInput, PaginationInput } from './dto/pagination.input';
import { Comment } from './entity/comments.entity';
import { Like } from './entity/likes.entity';
import { Twitte } from './entity/twitter-twittes.entity';
import {
  GqlCommentResponse,
  GqlCommentsResponse,
  GqlTwitteResponse,
  GqlTwittesPgResponse,
  GqlTwittesResponse,
} from './twitte.response';
import { TwittesService } from './twittes.service';
@UseGuards(JwtAuthGuard)
@Resolver((of) => Twitte)
export class TwittesResolver {
  constructor(private readonly twitteServ: TwittesService) {}
  // >>>>>>>>>>>>>>>>>>>>>>>>>> Mutaion  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // ------------------------------------------- Twitte -----------------------------------------

  @Mutation(() => GqlTwitteResponse, { name: 'createTwitte' })
  async createTwitte(
    @Args('input') input: CreateTwitteInput,
    @GetUser('id') userId: string,
  ) {
    return await this.twitteServ.create(input, userId);
  }

  @Mutation(() => GqlBooleanResponse, { name: 'delete' })
  async deletetwitte(
    @Args('id') twitteId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.twitteServ.delete(twitteId, userId);
  }

  // ------------------------------------------- Like -----------------------------------------

  @Mutation(() => GqlBooleanResponse, { name: 'like' })
  async like(@Args('id') twitteId: string, @GetUser('id') userId: string) {
    return await this.twitteServ.like(twitteId, userId);
  }
  @Mutation(() => GqlBooleanResponse, { name: 'unlike' })
  async unlike(@Args('id') twitteId: string, @GetUser('id') userId: string) {
    return await this.twitteServ.unLike(twitteId, userId);
  }
  // ------------------------------------------- Comment -----------------------------------------

  @Mutation(() => GqlCommentResponse, { name: 'createComment' })
  async createComment(
    @Args('input') input: CreateCommentInput,
    @GetUser('id') userId: string,
  ) {
    return await this.twitteServ.addComment(input, userId);
  }
  @Mutation(() => GqlBooleanResponse, { name: 'deleteComment' })
  async deleteComment(
    @Args('commentId') commentId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.twitteServ.deleteComment(commentId, userId);
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>> Query  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // ------------------------------------------- Twitte -----------------------------------------

  @Query(() => GqlTwittesPgResponse, { name: 'findAllTwittes' })
  async findAll(
    @Args('input') input: PaginationInput,
    @Args('filter') filter: FilterPgInput,
  ) {
    return await this.twitteServ.findAll(filter, input);
  }

  // @Query(() => GqlTwittesResponse, { name: 'findAllTwittesForUser' })
  // async findAllForUser(@Args('userName') userName: string) {
  //   return await this.twitteServ.findAllForUser(userName);
  // }

  // @Query(() => GqlTwittesPgResponse, { name: 'ds' })
  // async findAllForUxser() {
  //   return await this.twitteServ.findTweetsPaginate();
  // }

  // ########################## Comment  #######################################

  @Query(() => GqlCommentsResponse, { name: 'findAllComment' })
  async findAllComment(@Args('TwitteId') TwitteId: string) {
    return await this.twitteServ.FindAllComment(TwitteId);
  }

  // ################################### Resolver ##################################################
  @ResolveField(() => [User], { nullable: true })
  async users(
    @Parent() parent: Twitte,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { userId } = parent;

    return await loaders.userLoader.load(userId);
  }

  @ResolveField(() => [Like], { nullable: true })
  async likesTwitte(
    @Parent() parent: User,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { id } = parent;

    return await loaders.likesTwitteLoader.load(id);
  }
  @ResolveField(() => [Comment], { nullable: true })
  async commentsTwitte(
    @Parent() parent: User,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { id } = parent;

    return await loaders.commentTwitteLoader.load(id);
  }
}
