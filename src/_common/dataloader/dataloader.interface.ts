import { User } from 'src/user/entity/user.entity';
import {
  CommentLoaderType,
  CommentTwitteLoader,
  FollowereLoaderType,
  likeLoaderType,
  likesTwitteLoader,
  TwitteLoaderType,
  UserLoaderType,
} from './dataloader.type';

export interface IDataLoaderService {
  createLoaders(current?: User);
}

export interface IDataLoaders {
  commentLoader: CommentLoaderType;
  likeLoader: likeLoaderType;
  twitteLoader: TwitteLoaderType;
  followingLoader: FollowereLoaderType;
  followerLoader: FollowereLoaderType;
  userLoader: UserLoaderType;
  likesTwitteLoader: likesTwitteLoader;
  commentTwitteLoader: CommentTwitteLoader;
}
