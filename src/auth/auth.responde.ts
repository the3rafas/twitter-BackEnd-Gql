import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entity/user.entity';

@ObjectType()
export class loginResponde {
  @Field()
  access_Token: string;

  @Field(() => User)
  user: User;
}

export interface TokenResponde {
  access_Token: string;
  user: User;
}

import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';

export const GqlCodeResponse = generateGqlResponseType(loginResponde);
