import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { getColumnEnum } from 'src/_common/utils/columnEnum';
import { Twitte } from './twitter-twittes.entity';

@Table({
  tableName: 'Comments',
})
@ObjectType()
export class Comment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @AllowNull(true)
  @Column
  @Field({ nullable: true })
  content: string;

  @AllowNull(true)
  @Column
  @Field({ nullable: true })
  photo: string;

  @ForeignKey(() => Twitte)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  @Field()
  twitteId: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  @Field()
  userId: string;

  @BelongsTo(() => Twitte)
  @Field(() => Twitte)
  twitte: Twitte;
  @BelongsTo(() => User)
  user: User;
}
