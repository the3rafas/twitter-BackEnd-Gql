import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Follower } from './entity/follower.entity';
import { User } from './entity/user.entity';

export const GqlUserResponse = generateGqlResponseType(User);
export const GqlUsersResponse = generateGqlResponseType(Array(User));

export const GqlFollowerResponse = generateGqlResponseType(Follower);
export const GqlFollowersResponse = generateGqlResponseType(Array(Follower));
