import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Comment } from './entity/comments.entity';
import { Twitte } from './entity/twitter-twittes.entity';

export const GqlTwitteResponse = generateGqlResponseType(Twitte);
export const GqlTwittesResponse = generateGqlResponseType(Array(Twitte), true);
export const GqlTwittesPgResponse = generateGqlResponseType(Array(Twitte));


export const GqlCommentResponse = generateGqlResponseType(Comment);
export const GqlCommentsResponse = generateGqlResponseType(Array(Comment), true);
