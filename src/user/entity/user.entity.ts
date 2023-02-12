import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Comment } from 'src/twittes/entity/comments.entity';
import { Like } from 'src/twittes/entity/likes.entity';
import { Twitte } from 'src/twittes/entity/twitter-twittes.entity';
import { getColumnEnum } from 'src/_common/utils/columnEnum';
import { TGenderEnum } from '../user.enum';
import { Follower } from './follower.entity';

@Table({
  tableName: 'User',
})
@ObjectType()
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @AllowNull(false)
  @Column
  @Field()
  userName: string;

  @AllowNull(false)
  @Column
  @Field()
  name: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  bio?: string;

  @Unique
  @AllowNull(true)
  @Column({
    set(val: string) {
      val && typeof val === 'string'
        ? (this as any).setDataValue('email', val.toLowerCase())
        : (this as any).setDataValue('email', val);
    },
  })
  @Field({ nullable: true })
  email?: string;

  @AllowNull(true)
  @Column
  password: string;

  @Default(TGenderEnum.MALE)
  @AllowNull(false)
  @Column({ type: getColumnEnum(TGenderEnum) })
  @Field(() => TGenderEnum)
  gender: TGenderEnum;

  @AllowNull(true)
  @Column
  notVerifiedPhone?: string;

  @Unique
  @AllowNull(true)
  @Column
  @Field({ nullable: true })
  verifiedPhone?: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  birthDate?: Date;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  profilePicture?: string;

  @HasMany(() => Follower)
  followers: Follower[];

  @HasMany(() => Twitte)
  twittes: Twitte[];

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Comment)
  comments: Comment[];
}
