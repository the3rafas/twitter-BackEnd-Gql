import { Injectable, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment } from 'src/twittes/entity/comments.entity';
import { Like } from 'src/twittes/entity/likes.entity';
import { Twitte } from 'src/twittes/entity/twitter-twittes.entity';
import {
  GqlTwitteResponse,
  GqlTwittesResponse,
} from 'src/twittes/twitte.response';
import { IDataLoaders } from 'src/_common/dataloader/dataloader.interface';
import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';
import { CreateUserInput } from './dot/create-user.input';
import { Follower } from './entity/follower.entity';
import { User } from './entity/user.entity';
import { GqlFollowerResponse, GqlUserResponse } from './user.response';
import { twitterUserService } from './user.service';

@Resolver(() => User)
export class twitterUserResolver {
  constructor(private readonly userServ: twitterUserService) {}

  // ######################### MUTATIONC ##################################################
  // ------------------------------ User ----------------------------------------

  @Mutation(() => GqlUserResponse, { name: 'createTwitteruser' })
  async createuser(@Args('input') input: CreateUserInput) {
    return await this.userServ.createUser(input);
  }

  @Mutation(() => GqlUserResponse, { name: 'updateTwitteruser' })
  async updateUser(
    @Args('input') input: CreateUserInput,
    @CurrentUser() currentUser: User,
  ) {
    return await this.userServ.updateUser(input, currentUser);
  }
  // ---------------------------- Folow -----------------------------------------
  @UseGuards(JwtAuthGuard)
  @Query(() => GqlUserResponse, { name: 'me' })
  async me(@GetUser('id') userId: string) {
    return await this.userServ.me(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GqlBooleanResponse, { name: 'followUser' })
  async follow(
    @Args('followingId') followingId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.userServ.followUser(followingId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GqlBooleanResponse, { name: 'unfollowUser' })
  async unfollow(
    @Args('followingId') followingId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.userServ.deleteFollowUser(followingId, userId);
  }
  // ---------------------------- Friend -----------------------------------------
  // @UseGuards(JwtAuthGuard)
  // @Mutation(() => GqlBooleanResponse, { name: 'addFriend' })
  // async addFriend(
  //   @Args('followingId') followingId: string,
  //   @GetUser('id') userId: string,
  // ) {
  //   return await this.userServ.addFriend(followingId, userId);
  // }

  // ####################################### QUERY #####################################
  @UseGuards(JwtAuthGuard)
  @Query(() => GqlUserResponse, { name: 'findTwitteruser' })
  async findUser(@Args('userName') userName: string) {
    return await this.userServ.findUser(userName);
  }

  // -------------------------- FOllower --------------------------------------

  // @UseGuards(JwtAuthGuard)
  // @Query(() => Boolean, { name: 'checkFollowUser' })
  // async checkFollow(
  //   @Args('followingId') followingId: string,
  //   @GetUser('id') userId: string,
  // ) {
  //   return await this.userServ.checkFollowUser(followingId, userId);
  // }

  // ################################### Resolver ##################################################
  @ResolveField(() => [Twitte], { nullable: true })
  async twittes(
    @Parent() parent: User,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { id } = parent;

    return await loaders.twitteLoader.load(id);
  }

  @ResolveField(() => [Follower], { nullable: true })
  async followers(
    @Parent() parent: User,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { id } = parent;

    return await loaders.followerLoader.load(id);
  }

  @ResolveField(() => [Follower], { nullable: true })
  async following(
    @Parent() parent: User,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { id } = parent;

    return await loaders.followingLoader.load(id);
  }
  @ResolveField(() => [Like], { nullable: true })
  async likesTwitte(
    @Parent() parent: User,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { id } = parent;

    return await loaders.likeLoader.load(id);
  }

  @ResolveField(() => [Comment], { nullable: true })
  async comment(
    @Parent() parent: User,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    const { id } = parent;

    return await loaders.commentLoader.load(id);
  }
}
