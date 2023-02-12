import * as DataLoader from 'dataloader';
import { Comment } from 'src/twittes/entity/comments.entity';
import { Like } from 'src/twittes/entity/likes.entity';
import { Twitte } from 'src/twittes/entity/twitter-twittes.entity';
import { Follower } from 'src/user/entity/follower.entity';
import { User } from 'src/user/entity/user.entity';

export type UserLoaderType = DataLoader<string, User[]>;

export type TwitteLoaderType = DataLoader<string, Twitte[]>;
export type FollowereLoaderType = DataLoader<string, Follower[]>;
export type likeLoaderType = DataLoader<string, Like[]>;
export type CommentLoaderType = DataLoader<string, Comment[]>;
export type likesTwitteLoader = DataLoader<string, Like[]>;
export type CommentTwitteLoader = DataLoader<string, Comment[]>;

export type UserDataLoaderType = {
  commentLoader: CommentLoaderType;
  likeLoader: likeLoaderType;
  followerLoader: FollowereLoaderType;
  twitteLoader: TwitteLoaderType;
};

export type TwitteDataLoaderType = {
  userLoader: UserLoaderType;
  likesTwitteLoader: likesTwitteLoader;
  commentTwitteLoader: CommentTwitteLoader;
};
