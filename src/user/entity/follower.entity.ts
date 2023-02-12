import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { getColumnEnum } from 'src/_common/utils/columnEnum';
import { TGenderEnum } from '../user.enum';
import { User } from './user.entity';

@Table({
  tableName: 'twitter-Follower',
})
@ObjectType()
export class Follower extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  @Field({ description: 'userId' })
  followerId: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  @Field()
  followingId: string;

  @BelongsTo(() => User)
  @Field(() => User)
  user: User;
}
